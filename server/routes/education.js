const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { body, validationResult } = require("express-validator");

const db = require("../config/database");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

const EDUCATION_CERTIFICATES_DIR = path.resolve(
  __dirname,
  "../public-documents/education"
);

fs.mkdirSync(EDUCATION_CERTIFICATES_DIR, {
  recursive: true,
});

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, EDUCATION_CERTIFICATES_DIR);
  },

  filename: (req, file, cb) => {
    const originalName = path
      .basename(file.originalname)
      .replace(/[^a-zA-Z0-9._-]/g, "_");

    cb(null, `${Date.now()}-${originalName}`);
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
        new Error(
          "Invalid certificate file type. Only PDF, JPEG, PNG and WEBP files are allowed."
        )
      );
    }

    cb(null, true);
  },
});

const educationValidation = [
  body("period")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Period is required and must not exceed 100 characters."),

  body("qualification")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage(
      "Qualification is required and must not exceed 255 characters."
    ),

  body("institution")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage(
      "Institution is required and must not exceed 255 characters."
    ),

  body("description")
    .optional({ nullable: true })
    .isString()
    .withMessage("Description must be text."),

  body("display_order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer."),

  body("is_visible")
    .optional()
    .isBoolean()
    .withMessage("Visibility must be true or false."),
];

/*
|--------------------------------------------------------------------------
| Public - Get Visible Education
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        period,
        qualification,
        institution,
        description,
        certificate_path,
        display_order,
        is_visible,
        created_at,
        updated_at
      FROM education
      WHERE is_visible = true
      ORDER BY display_order ASC, id ASC
    `);

    return res.status(200).json({
      success: true,
      education: result.rows,
    });
  } catch (error) {
    console.error("Get public education error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load education.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Admin - Get All Education
|--------------------------------------------------------------------------
*/

router.get("/admin", requireAdmin, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        period,
        qualification,
        institution,
        description,
        certificate_path,
        display_order,
        is_visible,
        created_at,
        updated_at
      FROM education
      ORDER BY display_order ASC, id ASC
    `);

    return res.status(200).json({
      success: true,
      education: result.rows,
    });
  } catch (error) {
    console.error("Get admin education error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load education.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Admin - Create Education
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  requireAdmin,
  upload.single("certificate"),
  educationValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(400).json({
          success: false,
          message: "Invalid education data.",
          errors: errors.array(),
        });
      }

      const {
        period,
        qualification,
        institution,
        description = "",
      } = req.body;

      const displayOrder =
        req.body.display_order === undefined
          ? 0
          : Number(req.body.display_order);

      const isVisible =
        req.body.is_visible === undefined
          ? true
          : req.body.is_visible === true ||
            req.body.is_visible === "true";

      const certificatePath = req.file
        ? `education/${req.file.filename}`
        : null;

      const result = await db.query(
        `
          INSERT INTO education (
            period,
            qualification,
            institution,
            description,
            certificate_path,
            display_order,
            is_visible
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING
            id,
            period,
            qualification,
            institution,
            description,
            certificate_path,
            display_order,
            is_visible,
            created_at,
            updated_at
        `,
        [
          period,
          qualification,
          institution,
          description || null,
          certificatePath,
          displayOrder,
          isVisible,
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Education created successfully.",
        education: result.rows[0],
      });
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      console.error("Create education error:", error);

      return res.status(500).json({
        success: false,
        message:
          error.message || "Unable to create education.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| Admin - Update Education
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  requireAdmin,
  upload.single("certificate"),
  educationValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(400).json({
          success: false,
          message: "Invalid education data.",
          errors: errors.array(),
        });
      }

      const educationId = Number(req.params.id);

      if (!Number.isInteger(educationId) || educationId <= 0) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(400).json({
          success: false,
          message: "Invalid education ID.",
        });
      }

      const existingResult = await db.query(
        `
          SELECT certificate_path
          FROM education
          WHERE id = $1
          LIMIT 1
        `,
        [educationId]
      );

      if (existingResult.rows.length === 0) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(404).json({
          success: false,
          message: "Education not found.",
        });
      }

      const existingCertificatePath =
        existingResult.rows[0].certificate_path;

      const {
        period,
        qualification,
        institution,
        description = "",
      } = req.body;

      const displayOrder =
        req.body.display_order === undefined
          ? 0
          : Number(req.body.display_order);

      const isVisible =
        req.body.is_visible === undefined
          ? true
          : req.body.is_visible === true ||
            req.body.is_visible === "true";

      const certificatePath = req.file
        ? `education/${req.file.filename}`
        : existingCertificatePath;

      const result = await db.query(
        `
          UPDATE education
          SET
            period = $1,
            qualification = $2,
            institution = $3,
            description = $4,
            certificate_path = $5,
            display_order = $6,
            is_visible = $7,
            updated_at = NOW()
          WHERE id = $8
          RETURNING
            id,
            period,
            qualification,
            institution,
            description,
            certificate_path,
            display_order,
            is_visible,
            created_at,
            updated_at
        `,
        [
          period,
          qualification,
          institution,
          description || null,
          certificatePath,
          displayOrder,
          isVisible,
          educationId,
        ]
      );

      if (
        req.file &&
        existingCertificatePath &&
        existingCertificatePath.startsWith("education/")
      ) {
        const oldFilename = path.basename(
          existingCertificatePath
        );

        const oldFilePath = path.resolve(
          EDUCATION_CERTIFICATES_DIR,
          oldFilename
        );

        if (
          oldFilePath !== req.file.path &&
          fs.existsSync(oldFilePath)
        ) {
          fs.unlinkSync(oldFilePath);
        }
      }

      return res.status(200).json({
        success: true,
        message: "Education updated successfully.",
        education: result.rows[0],
      });
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      console.error("Update education error:", error);

      return res.status(500).json({
        success: false,
        message:
          error.message || "Unable to update education.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| Admin - Delete Education
|--------------------------------------------------------------------------
*/

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const educationId = Number(req.params.id);

    if (!Number.isInteger(educationId) || educationId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid education ID.",
      });
    }

    const existingResult = await db.query(
      `
        SELECT certificate_path
        FROM education
        WHERE id = $1
        LIMIT 1
      `,
      [educationId]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Education not found.",
      });
    }

    const certificatePath =
      existingResult.rows[0].certificate_path;

    const result = await db.query(
      `
        DELETE FROM education
        WHERE id = $1
        RETURNING id
      `,
      [educationId]
    );

    if (
      result.rowCount > 0 &&
      certificatePath &&
      certificatePath.startsWith("education/")
    ) {
      const filename = path.basename(certificatePath);

      const filePath = path.resolve(
        EDUCATION_CERTIFICATES_DIR,
        filename
      );

      if (
        filePath.startsWith(
          EDUCATION_CERTIFICATES_DIR + path.sep
        ) &&
        fs.existsSync(filePath)
      ) {
        fs.unlinkSync(filePath);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Education deleted successfully.",
    });
  } catch (error) {
    console.error("Delete education error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete education.",
    });
  }
});

module.exports = router;
