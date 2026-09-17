const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");
const sharp = require("sharp");
const { body, validationResult } = require("express-validator");
const { v2: cloudinary } = require("cloudinary");
const db = require("../config/database");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PROFILE_UPLOAD_DIR = path.join(
  __dirname,
  "..",
  "uploads",
  "profile"
);

fs.mkdirSync(PROFILE_UPLOAD_DIR, { recursive: true });

/*
|--------------------------------------------------------------------------
| Multer
|--------------------------------------------------------------------------
*/

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Invalid image format. Please upload JPEG, PNG, or WEBP."
        )
      );
    }

    cb(null, true);
  },
});

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const getProfileImageFilePath = (imagePath) => {
  if (!imagePath) {
    return null;
  }

  const filename = path.basename(imagePath);

  if (!filename || filename === "." || filename === "..") {
    return null;
  }

  return path.join(PROFILE_UPLOAD_DIR, filename);
};

const deleteProfileImageFile = (imagePath) => {
  const filePath = getProfileImageFilePath(imagePath);

  if (!filePath) {
    return;
  }

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Unable to delete profile image:", error);
  }
};

/*
|--------------------------------------------------------------------------
| Process Profile Image
|--------------------------------------------------------------------------
|
| Passport-style portrait:
| - 35 x 45 aspect ratio
| - 350 x 450 output
| - Focuses on the upper part of the original photo
| - Removes most of the body/legs from full-body photos
|
*/

const processProfileImage = async (buffer) => {
  const processedBuffer = await sharp(buffer)
    .rotate()
    .resize({
      width: 350,
      height: 450,
      fit: "contain",
      background: {
        r: 9,
        g: 13,
        b: 20,
        alpha: 1,
      },
    })
    .jpeg({
      quality: 90,
      mozjpeg: true,
    })
    .toBuffer();

  return processedBuffer;
};

const uploadProfileImageToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const publicId = crypto.randomUUID();

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "shija-portfolio/profile",
        public_id: publicId,
        resource_type: "image",
        format: "jpg",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });

const deleteCloudinaryProfileImage = async (imageUrl) => {
  if (
    !imageUrl ||
    !imageUrl.includes("res.cloudinary.com/")
  ) {
    return;
  }

  try {
    const marker = "/image/upload/";
    const markerIndex = imageUrl.indexOf(marker);

    if (markerIndex === -1) {
      return;
    }

    let publicId = imageUrl.substring(
      markerIndex + marker.length
    );

    publicId = publicId.replace(/^v\d+\//, "");
    publicId = publicId.replace(/\.[^/.]+$/, "");

    if (!publicId) {
      return;
    }

    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      type: "upload",
    });
  } catch (error) {
    console.error(
      "Unable to delete Cloudinary profile image:",
      error
    );
  }
};

/*
|--------------------------------------------------------------------------
| PUBLIC
| Get portfolio profile
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT
        id,
        full_name,
        professional_title,
        bio,
        phone,
        email,
        location,
        linkedin_url,
        github_url,
        profile_image_path,
        updated_at
       FROM profile
       ORDER BY id
       LIMIT 1`
    );

    res.json({
      success: true,
      profile: result.rows[0] || null,
    });
  } catch (error) {
    next(error);
  }
});

/*
|--------------------------------------------------------------------------
| ADMIN
| Get profile
|--------------------------------------------------------------------------
*/

router.get("/admin", requireAdmin, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT
        id,
        full_name,
        professional_title,
        bio,
        phone,
        email,
        location,
        linkedin_url,
        github_url,
        profile_image_path,
        updated_at
       FROM profile
       ORDER BY id
       LIMIT 1`
    );

    res.json({
      success: true,
      profile: result.rows[0] || null,
    });
  } catch (error) {
    next(error);
  }
});

/*
|--------------------------------------------------------------------------
| ADMIN
| Create profile
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  requireAdmin,
  [
    body("full_name")
      .trim()
      .notEmpty()
      .withMessage("Full name is required")
      .isLength({ max: 255 })
      .withMessage("Full name is too long"),

    body("professional_title")
      .optional({ nullable: true })
      .trim()
      .isLength({ max: 255 })
      .withMessage("Professional title is too long"),

    body("bio")
      .optional({ nullable: true })
      .trim(),

    body("phone")
      .optional({ nullable: true })
      .trim()
      .isLength({ max: 50 })
      .withMessage("Phone number is too long"),

    body("email")
      .optional({ nullable: true })
      .trim()
      .isEmail()
      .withMessage("Invalid email address"),

    body("location")
      .optional({ nullable: true })
      .trim()
      .isLength({ max: 255 })
      .withMessage("Location is too long"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const existing = await db.query(
        "SELECT id FROM profile ORDER BY id LIMIT 1"
      );

      if (existing.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Profile already exists. Use PUT to update it.",
        });
      }

      const {
        full_name,
        professional_title,
        bio,
        phone,
        email,
        location,
        linkedin_url,
        github_url,
      } = req.body;

      const result = await db.query(
        `INSERT INTO profile (
          full_name,
          professional_title,
          bio,
          phone,
          email,
          location,
          linkedin_url,
          github_url,
          profile_image_path
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NULL)
        RETURNING
          id,
          full_name,
          professional_title,
          bio,
          phone,
          email,
          location,
          linkedin_url,
          github_url,
          profile_image_path,
          updated_at`,
        [
          full_name,
          professional_title || null,
          bio || null,
          phone || null,
          email || null,
          location || null,
          linkedin_url || null,
          github_url || null,
        ]
      );

      res.status(201).json({
        success: true,
        message: "Profile created successfully.",
        profile: result.rows[0],
      });
    } catch (error) {
      next(error);
    }
  }
);

/*
|--------------------------------------------------------------------------
| ADMIN
| Update profile
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  requireAdmin,
  [
    body("full_name")
      .trim()
      .notEmpty()
      .withMessage("Full name is required")
      .isLength({ max: 255 })
      .withMessage("Full name is too long"),

    body("professional_title")
      .optional({ nullable: true })
      .trim()
      .isLength({ max: 255 })
      .withMessage("Professional title is too long"),

    body("bio")
      .optional({ nullable: true })
      .trim(),

    body("phone")
      .optional({ nullable: true })
      .trim()
      .isLength({ max: 50 })
      .withMessage("Phone number is too long"),

    body("email")
      .optional({ nullable: true })
      .trim()
      .isEmail()
      .withMessage("Invalid email address"),

    body("location")
      .optional({ nullable: true })
      .trim()
      .isLength({ max: 255 })
      .withMessage("Location is too long"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const {
        full_name,
        professional_title,
        bio,
        phone,
        email,
        location,
        linkedin_url,
        github_url,
      } = req.body;

      const result = await db.query(
        `UPDATE profile
         SET
          full_name = $1,
          professional_title = $2,
          bio = $3,
          phone = $4,
          email = $5,
          location = $6,
          linkedin_url = $7,
          github_url = $8,
          updated_at = NOW()
         WHERE id = $9
         RETURNING
          id,
          full_name,
          professional_title,
          bio,
          phone,
          email,
          location,
          linkedin_url,
          github_url,
          profile_image_path,
          updated_at`,
        [
          full_name,
          professional_title || null,
          bio || null,
          phone || null,
          email || null,
          location || null,
          linkedin_url || null,
          github_url || null,
          req.params.id,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Profile not found.",
        });
      }

      res.json({
        success: true,
        message: "Profile updated successfully.",
        profile: result.rows[0],
      });
    } catch (error) {
      next(error);
    }
  }
);

/*
|--------------------------------------------------------------------------
| ADMIN
| Upload / Replace Profile Image
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/image",
  requireAdmin,
  (req, res, next) => {
    upload.single("profile_image")(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "Profile image must not exceed 10 MB.",
          });
        }

        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      if (error) {
        return res.status(400).json({
          success: false,
          message:
            error.message || "Unable to process image upload.",
        });
      }

      next();
    });
  },
  async (req, res, next) => {
    let processedImage = null;

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select an image.",
        });
      }

      const profileResult = await db.query(
        `SELECT
          id,
          profile_image_path
         FROM profile
         WHERE id = $1`,
        [req.params.id]
      );

      if (profileResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Profile not found.",
        });
      }

      const oldImagePath =
        profileResult.rows[0].profile_image_path;

      processedImage = await processProfileImage(
        req.file.buffer
      );

      const cloudinaryResult =
        await uploadProfileImageToCloudinary(
          processedImage
        );

      const result = await db.query(
        `UPDATE profile
         SET
          profile_image_path = $1,
          updated_at = NOW()
         WHERE id = $2
         RETURNING
          id,
          full_name,
          professional_title,
          bio,
          phone,
          email,
          location,
          profile_image_path,
          updated_at`,
        [
          cloudinaryResult.secure_url,
          req.params.id,
        ]
      );

      if (result.rows.length === 0) {
        try {
          await cloudinary.uploader.destroy(
            cloudinaryResult.public_id,
            {
              resource_type: "image",
              type: "upload",
            }
          );
        } catch (cleanupError) {
          console.error(
            "Unable to clean uploaded Cloudinary image:",
            cleanupError
          );
        }

        return res.status(404).json({
          success: false,
          message: "Profile not found.",
        });
      }

      await deleteCloudinaryProfileImage(oldImagePath);
      deleteProfileImageFile(oldImagePath);

      return res.json({
        success: true,
        message: "Profile image uploaded successfully.",
        profile: result.rows[0],
      });
    } catch (error) {
      next(error);
    }
  }
);

/*
|--------------------------------------------------------------------------
| ADMIN
| Delete Profile Image
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id/image",
  requireAdmin,
  async (req, res, next) => {
    try {
      const existing = await db.query(
        `SELECT
          id,
          profile_image_path
         FROM profile
         WHERE id = $1`,
        [req.params.id]
      );

      if (existing.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Profile not found.",
        });
      }

      const oldImagePath =
        existing.rows[0].profile_image_path;

      const result = await db.query(
        `UPDATE profile
         SET
          profile_image_path = NULL,
          updated_at = NOW()
         WHERE id = $1
         RETURNING
          id,
          full_name,
          professional_title,
          bio,
          phone,
          email,
          location,
          profile_image_path,
          updated_at`,
        [req.params.id]
      );

      await deleteCloudinaryProfileImage(oldImagePath);
      deleteProfileImageFile(oldImagePath);

      return res.json({
        success: true,
        message: "Profile image removed successfully.",
        profile: result.rows[0],
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
