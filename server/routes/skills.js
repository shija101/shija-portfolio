const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../config/database");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

/*
 * PUBLIC
 * Get visible skills only
 */
router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT
        id,
        category,
        name,
        description,
        display_order
       FROM skills
       WHERE is_visible = true
       ORDER BY display_order, id`
    );

    res.json({
      success: true,
      skills: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

/*
 * ADMIN
 * Get all skills
 */
router.get("/admin", requireAdmin, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT
        id,
        category,
        name,
        description,
        display_order,
        is_visible,
        created_at,
        updated_at
       FROM skills
       ORDER BY display_order, id`
    );

    res.json({
      success: true,
      skills: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

/*
 * ADMIN
 * Create skill
 */
router.post(
  "/",
  requireAdmin,
  [
    body("category")
      .trim()
      .notEmpty()
      .withMessage("Category is required")
      .isLength({ max: 150 })
      .withMessage("Category is too long"),

    body("name")
      .trim()
      .notEmpty()
      .withMessage("Skill name is required")
      .isLength({ max: 150 })
      .withMessage("Skill name is too long"),

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
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const {
        category,
        name,
        description,
        display_order,
        is_visible,
      } = req.body;

      const result = await db.query(
        `INSERT INTO skills (
          category,
          name,
          description,
          display_order,
          is_visible
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
          id,
          category,
          name,
          description,
          display_order,
          is_visible,
          created_at,
          updated_at`,
        [
          category,
          name,
          description || null,
          display_order ?? 0,
          is_visible ?? true,
        ]
      );

      res.status(201).json({
        success: true,
        skill: result.rows[0],
      });
    } catch (error) {
      next(error);
    }
  }
);

/*
 * ADMIN
 * Update skill
 */
router.put(
  "/:id",
  requireAdmin,
  [
    body("category")
      .trim()
      .notEmpty()
      .withMessage("Category is required")
      .isLength({ max: 150 })
      .withMessage("Category is too long"),

    body("name")
      .trim()
      .notEmpty()
      .withMessage("Skill name is required")
      .isLength({ max: 150 })
      .withMessage("Skill name is too long"),

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
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const {
        category,
        name,
        description,
        display_order,
        is_visible,
      } = req.body;

      const result = await db.query(
        `UPDATE skills
         SET
          category = $1,
          name = $2,
          description = $3,
          display_order = $4,
          is_visible = $5,
          updated_at = NOW()
         WHERE id = $6
         RETURNING
          id,
          category,
          name,
          description,
          display_order,
          is_visible,
          created_at,
          updated_at`,
        [
          category,
          name,
          description || null,
          display_order ?? 0,
          is_visible ?? true,
          req.params.id,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Skill not found",
        });
      }

      res.json({
        success: true,
        skill: result.rows[0],
      });
    } catch (error) {
      next(error);
    }
  }
);

/*
 * ADMIN
 * Delete skill
 */
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const result = await db.query(
      `DELETE FROM skills
       WHERE id = $1
       RETURNING id`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
