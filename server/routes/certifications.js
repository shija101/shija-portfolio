const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { body, validationResult } = require("express-validator");

const db = require("../config/database");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

const CERTIFICATES_DIR = path.resolve(
  __dirname,
  "../public-documents/certificates"
);

fs.mkdirSync(CERTIFICATES_DIR, { recursive: true });

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, CERTIFICATES_DIR);
  },

  filename: (req, file, cb) => {
    const originalName = path
      .basename(file.originalname)
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    const uniqueName = `${Date.now()}-${originalName}`;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(
        new Error("Only PDF, JPEG, PNG and WEBP files are allowed")
      );
    }

    cb(null, true);
  },
});

/*
 * PUBLIC
 * Get visible certifications only
 */
router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT
        id,
        title,
        issuer,
        status,
        certificate_path,
        description,
        display_order
       FROM certifications
       WHERE is_visible = true
       ORDER BY display_order, id`
    );

    res.json({
      success: true,
      certifications: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

/*
 * ADMIN
 * Get all certifications
 */
router.get("/admin", requireAdmin, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT
        id,
        title,
        issuer,
        status,
        certificate_path,
        description,
        display_order,
        is_visible,
        created_at,
        updated_at
       FROM certifications
       ORDER BY display_order, id`
    );

    res.json({
      success: true,
      certifications: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

/*
 * ADMIN
 * Create certification with optional certificate upload
 */
router.post(
  "/",
  requireAdmin,
  upload.single("certificate"),
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ max: 255 })
      .withMessage("Title is too long"),

    body("issuer")
      .trim()
      .notEmpty()
      .withMessage("Issuer is required")
      .isLength({ max: 255 })
      .withMessage("Issuer is too long"),

    body("status")
      .trim()
      .notEmpty()
      .withMessage("Status is required")
      .isLength({ max: 50 })
      .withMessage("Status is too long"),

    body("description")
      .optional({ nullable: true })
      .trim(),

    body("display_order")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Display order must be a non-negative integer"),

    body("is_visible")
      .optional()
      .isBoolean()
      .withMessage("is_visible must be boolean"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const {
        title,
        issuer,
        status,
        description,
        display_order,
        is_visible,
      } = req.body;

      const certificatePath = req.file
        ? `certificates/${req.file.filename}`
        : null;

      const result = await db.query(
        `INSERT INTO certifications (
          title,
          issuer,
          status,
          certificate_path,
          description,
          display_order,
          is_visible
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING
          id,
          title,
          issuer,
          status,
          certificate_path,
          description,
          display_order,
          is_visible,
          created_at,
          updated_at`,
        [
          title,
          issuer,
          status,
          certificatePath,
          description || null,
          display_order ?? 0,
          is_visible === undefined ? true : is_visible === "true" || is_visible === true,
        ]
      );

      res.status(201).json({
        success: true,
        certification: result.rows[0],
      });
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      next(error);
    }
  }
);

/*
 * ADMIN
 * Update certification
 *
 * If a new certificate is uploaded,
 * the old certificate is removed.
 */
router.put(
  "/:id",
  requireAdmin,
  upload.single("certificate"),
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ max: 255 })
      .withMessage("Title is too long"),

    body("issuer")
      .trim()
      .notEmpty()
      .withMessage("Issuer is required")
      .isLength({ max: 255 })
      .withMessage("Issuer is too long"),

    body("status")
      .trim()
      .notEmpty()
      .withMessage("Status is required")
      .isLength({ max: 50 })
      .withMessage("Status is too long"),

    body("description")
      .optional({ nullable: true })
      .trim(),

    body("display_order")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Display order must be a non-negative integer"),

    body("is_visible")
      .optional()
      .isBoolean()
      .withMessage("is_visible must be boolean"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const existing = await db.query(
        `SELECT certificate_path
         FROM certifications
         WHERE id = $1`,
        [req.params.id]
      );

      if (existing.rows.length === 0) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(404).json({
          success: false,
          message: "Certification not found",
        });
      }

      const oldCertificatePath = existing.rows[0].certificate_path;

      const {
        title,
        issuer,
        status,
        description,
        display_order,
        is_visible,
      } = req.body;

      const newCertificatePath = req.file
        ? `certificates/${req.file.filename}`
        : oldCertificatePath;

      const result = await db.query(
        `UPDATE certifications
         SET
          title = $1,
          issuer = $2,
          status = $3,
          certificate_path = $4,
          description = $5,
          display_order = $6,
          is_visible = $7,
          updated_at = NOW()
         WHERE id = $8
         RETURNING
          id,
          title,
          issuer,
          status,
          certificate_path,
          description,
          display_order,
          is_visible,
          created_at,
          updated_at`,
        [
          title,
          issuer,
          status,
          newCertificatePath,
          description || null,
          display_order ?? 0,
          is_visible === undefined
            ? true
            : is_visible === "true" || is_visible === true,
          req.params.id,
        ]
      );

      if (
        req.file &&
        oldCertificatePath &&
        oldCertificatePath !== newCertificatePath
      ) {
        const oldFile = path.resolve(
          CERTIFICATES_DIR,
          path.basename(oldCertificatePath)
        );

        if (fs.existsSync(oldFile)) {
          fs.unlinkSync(oldFile);
        }
      }

      res.json({
        success: true,
        certification: result.rows[0],
      });
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      next(error);
    }
  }
);

/*
 * ADMIN
 * Delete certification and its certificate file
 */
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const existing = await db.query(
      `SELECT certificate_path
       FROM certifications
       WHERE id = $1`,
      [req.params.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
      });
    }

    const certificatePath = existing.rows[0].certificate_path;

    await db.query(
      `DELETE FROM certifications
       WHERE id = $1`,
      [req.params.id]
    );

    if (certificatePath) {
      const filePath = path.resolve(
        CERTIFICATES_DIR,
        path.basename(certificatePath)
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({
      success: true,
      message: "Certification deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
