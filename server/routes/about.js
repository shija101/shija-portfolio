const express = require("express");
const pool = require("../config/database");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

/**
 * GET /api/about
 * Public: return visible About records.
 */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        introduction,
        goal,
        field,
        specialization,
        focus,
        status,
        display_order,
        is_visible,
        created_at,
        updated_at
       FROM about
       WHERE is_visible = TRUE
       ORDER BY display_order ASC, id ASC`
    );

    res.json({
      success: true,
      about: result.rows,
    });
  } catch (error) {
    console.error("GET /about error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load About information.",
    });
  }
});

/**
 * GET /api/about/admin
 * Admin: return all About records.
 */
router.get("/admin", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        introduction,
        goal,
        field,
        specialization,
        focus,
        status,
        display_order,
        is_visible,
        created_at,
        updated_at
       FROM about
       ORDER BY display_order ASC, id ASC`
    );

    res.json({
      success: true,
      about: result.rows,
    });
  } catch (error) {
    console.error("GET /about/admin error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load About information.",
    });
  }
});

/**
 * POST /api/about
 * Admin: create About record.
 */
router.post("/", requireAdmin, async (req, res) => {
  const {
    introduction = "",
    goal = "",
    field = "",
    specialization = "",
    focus = "",
    status = "",
    display_order = 0,
    is_visible = true,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO about (
        introduction,
        goal,
        field,
        specialization,
        focus,
        status,
        display_order,
        is_visible
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        introduction,
        goal,
        field,
        specialization,
        focus,
        status,
        Number(display_order) || 0,
        is_visible === true || is_visible === "true",
      ]
    );

    res.status(201).json({
      success: true,
      message: "About information created successfully.",
      about: result.rows[0],
    });
  } catch (error) {
    console.error("POST /about error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create About information.",
    });
  }
});

/**
 * PUT /api/about/:id
 * Admin: update About record.
 */
router.put("/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;

  const {
    introduction = "",
    goal = "",
    field = "",
    specialization = "",
    focus = "",
    status = "",
    display_order = 0,
    is_visible = true,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE about
       SET
        introduction = $1,
        goal = $2,
        field = $3,
        specialization = $4,
        focus = $5,
        status = $6,
        display_order = $7,
        is_visible = $8,
        updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [
        introduction,
        goal,
        field,
        specialization,
        focus,
        status,
        Number(display_order) || 0,
        is_visible === true || is_visible === "true",
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "About information not found.",
      });
    }

    res.json({
      success: true,
      message: "About information updated successfully.",
      about: result.rows[0],
    });
  } catch (error) {
    console.error("PUT /about/:id error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update About information.",
    });
  }
});

/**
 * DELETE /api/about/:id
 * Admin: delete About record.
 */
router.delete("/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM about
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "About information not found.",
      });
    }

    res.json({
      success: true,
      message: "About information deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /about/:id error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete About information.",
    });
  }
});

module.exports = router;
