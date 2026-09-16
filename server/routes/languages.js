const express = require("express");
const { body, validationResult } = require("express-validator");

const db = require("../config/database");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

const languageValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Language name is required.")
    .isLength({ max: 100 })
    .withMessage("Language name is too long."),

  body("proficiency")
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 100 })
    .withMessage("Proficiency is too long."),

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
| Public - Get Visible Languages
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        name,
        proficiency,
        display_order
      FROM languages
      WHERE is_visible = true
      ORDER BY display_order ASC, id ASC
    `);

    return res.status(200).json({
      success: true,
      languages: result.rows,
    });
  } catch (error) {
    console.error("Get public languages error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load languages.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Admin - Get All Languages
|--------------------------------------------------------------------------
*/

router.get("/admin", requireAdmin, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        name,
        proficiency,
        display_order,
        is_visible,
        created_at,
        updated_at
      FROM languages
      ORDER BY display_order ASC, id ASC
    `);

    return res.status(200).json({
      success: true,
      languages: result.rows,
    });
  } catch (error) {
    console.error("Get admin languages error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load languages.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Admin - Create Language
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  requireAdmin,
  languageValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Invalid language data.",
          errors: errors.array(),
        });
      }

      const {
        name,
        proficiency = null,
        display_order = 0,
        is_visible = true,
      } = req.body;

      const result = await db.query(
        `
          INSERT INTO languages (
            name,
            proficiency,
            display_order,
            is_visible
          )
          VALUES ($1, $2, $3, $4)
          RETURNING
            id,
            name,
            proficiency,
            display_order,
            is_visible,
            created_at,
            updated_at
        `,
        [
          name,
          proficiency,
          display_order,
          is_visible,
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Language created successfully.",
        language: result.rows[0],
      });
    } catch (error) {
      console.error("Create language error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to create language.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| Admin - Update Language
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  requireAdmin,
  languageValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Invalid language data.",
          errors: errors.array(),
        });
      }

      const languageId = Number(req.params.id);

      if (!Number.isInteger(languageId) || languageId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid language ID.",
        });
      }

      const {
        name,
        proficiency = null,
        display_order = 0,
        is_visible = true,
      } = req.body;

      const result = await db.query(
        `
          UPDATE languages
          SET
            name = $1,
            proficiency = $2,
            display_order = $3,
            is_visible = $4,
            updated_at = NOW()
          WHERE id = $5
          RETURNING
            id,
            name,
            proficiency,
            display_order,
            is_visible,
            created_at,
            updated_at
        `,
        [
          name,
          proficiency,
          display_order,
          is_visible,
          languageId,
        ]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Language not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Language updated successfully.",
        language: result.rows[0],
      });
    } catch (error) {
      console.error("Update language error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to update language.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| Admin - Delete Language
|--------------------------------------------------------------------------
*/

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const languageId = Number(req.params.id);

    if (!Number.isInteger(languageId) || languageId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid language ID.",
      });
    }

    const result = await db.query(
      `
        DELETE FROM languages
        WHERE id = $1
        RETURNING id
      `,
      [languageId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Language not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Language deleted successfully.",
    });
  } catch (error) {
    console.error("Delete language error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete language.",
    });
  }
});

module.exports = router;
