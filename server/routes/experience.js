const express = require("express");
const { body, validationResult } = require("express-validator");

const db = require("../config/database");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

const experienceValidation = [
  body("date_range")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Date range is required and must not exceed 100 characters."),

  body("role")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Role is required and must not exceed 255 characters."),

  body("company")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Company is required and must not exceed 255 characters."),

  body("description")
    .optional({ nullable: true })
    .isString()
    .withMessage("Description must be text."),

  body("activities")
    .optional()
    .isArray()
    .withMessage("Activities must be an array."),

  body("display_order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer."),

  body("is_visible")
    .optional()
    .isBoolean()
    .withMessage("Visibility must be true or false."),
];

router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        date_range,
        role,
        company,
        description,
        activities,
        display_order,
        is_visible,
        created_at,
        updated_at
      FROM experience
      WHERE is_visible = true
      ORDER BY display_order ASC, id ASC
    `);

    return res.status(200).json({
      success: true,
      experience: result.rows,
    });
  } catch (error) {
    console.error("Get public experience error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load experience.",
    });
  }
});

router.get("/admin", requireAdmin, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        date_range,
        role,
        company,
        description,
        activities,
        display_order,
        is_visible,
        created_at,
        updated_at
      FROM experience
      ORDER BY display_order ASC, id ASC
    `);

    return res.status(200).json({
      success: true,
      experience: result.rows,
    });
  } catch (error) {
    console.error("Get admin experience error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load experience.",
    });
  }
});

router.post(
  "/",
  requireAdmin,
  experienceValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Invalid experience data.",
          errors: errors.array(),
        });
      }

      const {
        date_range,
        role,
        company,
        description = null,
        activities = [],
        display_order = 0,
        is_visible = true,
      } = req.body;

      const result = await db.query(
        `
          INSERT INTO experience (
            date_range,
            role,
            company,
            description,
            activities,
            display_order,
            is_visible
          )
          VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7)
          RETURNING
            id,
            date_range,
            role,
            company,
            description,
            activities,
            display_order,
            is_visible,
            created_at,
            updated_at
        `,
        [
          date_range,
          role,
          company,
          description,
          JSON.stringify(activities),
          display_order,
          is_visible,
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Experience created successfully.",
        experience: result.rows[0],
      });
    } catch (error) {
      console.error("Create experience error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to create experience.",
      });
    }
  }
);

router.put(
  "/:id",
  requireAdmin,
  experienceValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Invalid experience data.",
          errors: errors.array(),
        });
      }

      const experienceId = Number(req.params.id);

      if (!Number.isInteger(experienceId) || experienceId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid experience ID.",
        });
      }

      const {
        date_range,
        role,
        company,
        description = null,
        activities = [],
        display_order = 0,
        is_visible = true,
      } = req.body;

      const result = await db.query(
        `
          UPDATE experience
          SET
            date_range = $1,
            role = $2,
            company = $3,
            description = $4,
            activities = $5::jsonb,
            display_order = $6,
            is_visible = $7,
            updated_at = NOW()
          WHERE id = $8
          RETURNING
            id,
            date_range,
            role,
            company,
            description,
            activities,
            display_order,
            is_visible,
            created_at,
            updated_at
        `,
        [
          date_range,
          role,
          company,
          description,
          JSON.stringify(activities),
          display_order,
          is_visible,
          experienceId,
        ]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Experience not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Experience updated successfully.",
        experience: result.rows[0],
      });
    } catch (error) {
      console.error("Update experience error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to update experience.",
      });
    }
  }
);

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const experienceId = Number(req.params.id);

    if (!Number.isInteger(experienceId) || experienceId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid experience ID.",
      });
    }

    const result = await db.query(
      `
        DELETE FROM experience
        WHERE id = $1
        RETURNING id
      `,
      [experienceId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Experience not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Experience deleted successfully.",
    });
  } catch (error) {
    console.error("Delete experience error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete experience.",
    });
  }
});

module.exports = router;
