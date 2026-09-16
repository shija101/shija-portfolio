const express = require("express");
const { body, validationResult } = require("express-validator");

const db = require("../config/database");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

const interestValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Interest name is required.")
    .isLength({ max: 150 })
    .withMessage("Interest name is too long."),

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
| Public - Get Visible Interests
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
      FROM interests
      WHERE is_visible = true
      ORDER BY display_order ASC, id ASC
    `);

    return res.status(200).json({
      success: true,
      interests: result.rows,
    });
  } catch (error) {
    console.error("Get public interests error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load interests.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Admin - Get All Interests
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
      FROM interests
      ORDER BY display_order ASC, id ASC
    `);

    return res.status(200).json({
      success: true,
      interests: result.rows,
    });
  } catch (error) {
    console.error("Get admin interests error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load interests.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Admin - Create Interest
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  requireAdmin,
  interestValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Invalid interest data.",
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
          INSERT INTO interests (
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
        message: "Interest created successfully.",
        interest: result.rows[0],
      });
    } catch (error) {
      console.error("Create interest error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to create interest.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| Admin - Update Interest
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  requireAdmin,
  interestValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Invalid interest data.",
          errors: errors.array(),
        });
      }

      const interestId = Number(req.params.id);

      if (!Number.isInteger(interestId) || interestId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid interest ID.",
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
          UPDATE interests
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
          interestId,
        ]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Interest not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Interest updated successfully.",
        interest: result.rows[0],
      });
    } catch (error) {
      console.error("Update interest error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to update interest.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| Admin - Delete Interest
|--------------------------------------------------------------------------
*/

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const interestId = Number(req.params.id);

    if (!Number.isInteger(interestId) || interestId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid interest ID.",
      });
    }

    const result = await db.query(
      `
        DELETE FROM interests
        WHERE id = $1
        RETURNING id
      `,
      [interestId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Interest not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interest deleted successfully.",
    });
  } catch (error) {
    console.error("Delete interest error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete interest.",
    });
  }
});

module.exports = router;
