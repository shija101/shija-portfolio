const express = require("express");
const { body, validationResult } = require("express-validator");

const db = require("../config/database");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

const professionalSkillValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Professional skill name is required.")
    .isLength({ max: 150 })
    .withMessage("Professional skill name is too long."),

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
| Public - Get Visible Professional Skills
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        name,
        description,
        display_order
      FROM professional_skills
      WHERE is_visible = true
      ORDER BY display_order ASC, id ASC
    `);

    return res.status(200).json({
      success: true,
      professional_skills: result.rows,
    });
  } catch (error) {
    console.error("Get public professional skills error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load professional skills.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Admin - Get All Professional Skills
|--------------------------------------------------------------------------
*/

router.get("/admin", requireAdmin, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        name,
        description,
        display_order,
        is_visible,
        created_at,
        updated_at
      FROM professional_skills
      ORDER BY display_order ASC, id ASC
    `);

    return res.status(200).json({
      success: true,
      professional_skills: result.rows,
    });
  } catch (error) {
    console.error("Get admin professional skills error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load professional skills.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Admin - Create Professional Skill
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  requireAdmin,
  professionalSkillValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Invalid professional skill data.",
          errors: errors.array(),
        });
      }

      const {
        name,
        description = null,
        display_order = 0,
        is_visible = true,
      } = req.body;

      const result = await db.query(
        `
          INSERT INTO professional_skills (
            name,
            description,
            display_order,
            is_visible
          )
          VALUES ($1, $2, $3, $4)
          RETURNING
            id,
            name,
            description,
            display_order,
            is_visible,
            created_at,
            updated_at
        `,
        [
          name,
          description,
          display_order,
          is_visible,
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Professional skill created successfully.",
        professional_skill: result.rows[0],
      });
    } catch (error) {
      console.error("Create professional skill error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to create professional skill.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| Admin - Update Professional Skill
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  requireAdmin,
  professionalSkillValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Invalid professional skill data.",
          errors: errors.array(),
        });
      }

      const skillId = Number(req.params.id);

      if (!Number.isInteger(skillId) || skillId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid professional skill ID.",
        });
      }

      const {
        name,
        description = null,
        display_order = 0,
        is_visible = true,
      } = req.body;

      const result = await db.query(
        `
          UPDATE professional_skills
          SET
            name = $1,
            description = $2,
            display_order = $3,
            is_visible = $4,
            updated_at = NOW()
          WHERE id = $5
          RETURNING
            id,
            name,
            description,
            display_order,
            is_visible,
            created_at,
            updated_at
        `,
        [
          name,
          description,
          display_order,
          is_visible,
          skillId,
        ]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Professional skill not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Professional skill updated successfully.",
        professional_skill: result.rows[0],
      });
    } catch (error) {
      console.error("Update professional skill error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to update professional skill.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| Admin - Delete Professional Skill
|--------------------------------------------------------------------------
*/

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const skillId = Number(req.params.id);

    if (!Number.isInteger(skillId) || skillId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid professional skill ID.",
      });
    }

    const result = await db.query(
      `
        DELETE FROM professional_skills
        WHERE id = $1
        RETURNING id
      `,
      [skillId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Professional skill not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Professional skill deleted successfully.",
    });
  } catch (error) {
    console.error("Delete professional skill error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete professional skill.",
    });
  }
});

module.exports = router;
