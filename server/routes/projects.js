const express = require("express");
const { body, validationResult } = require("express-validator");

const db = require("../config/database");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

const projectValidation = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Project title is required and must not exceed 255 characters."),

  body("category")
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 150 })
    .withMessage("Category must not exceed 150 characters."),

  body("description")
    .optional({ nullable: true })
    .isString()
    .withMessage("Description must be text."),

  body("technologies")
    .optional()
    .isArray()
    .withMessage("Technologies must be an array."),

  body("project_url")
    .optional({ nullable: true })
    .isString()
    .withMessage("Project URL must be text."),

  body("repository_url")
    .optional({ nullable: true })
    .isString()
    .withMessage("Repository URL must be text."),

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
| Public - Get Visible Projects
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        title,
        category,
        description,
        technologies,
        project_url,
        repository_url,
        display_order,
        is_visible,
        created_at,
        updated_at
      FROM projects
      WHERE is_visible = true
      ORDER BY display_order ASC, id ASC
    `);

    return res.status(200).json({
      success: true,
      projects: result.rows,
    });
  } catch (error) {
    console.error("Get public projects error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load projects.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Admin - Get All Projects
|--------------------------------------------------------------------------
*/

router.get("/admin", requireAdmin, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        title,
        category,
        description,
        technologies,
        project_url,
        repository_url,
        display_order,
        is_visible,
        created_at,
        updated_at
      FROM projects
      ORDER BY display_order ASC, id ASC
    `);

    return res.status(200).json({
      success: true,
      projects: result.rows,
    });
  } catch (error) {
    console.error("Get admin projects error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load projects.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Admin - Create Project
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  requireAdmin,
  projectValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Invalid project data.",
          errors: errors.array(),
        });
      }

      const {
        title,
        category = null,
        description = null,
        technologies = [],
        project_url = null,
        repository_url = null,
        display_order = 0,
        is_visible = true,
      } = req.body;

      const result = await db.query(
        `
          INSERT INTO projects (
            title,
            category,
            description,
            technologies,
            project_url,
            repository_url,
            display_order,
            is_visible
          )
          VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8)
          RETURNING
            id,
            title,
            category,
            description,
            technologies,
            project_url,
            repository_url,
            display_order,
            is_visible,
            created_at,
            updated_at
        `,
        [
          title,
          category,
          description,
          JSON.stringify(technologies),
          project_url,
          repository_url,
          display_order,
          is_visible,
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Project created successfully.",
        project: result.rows[0],
      });
    } catch (error) {
      console.error("Create project error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to create project.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| Admin - Update Project
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  requireAdmin,
  projectValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Invalid project data.",
          errors: errors.array(),
        });
      }

      const projectId = Number(req.params.id);

      if (!Number.isInteger(projectId) || projectId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID.",
        });
      }

      const {
        title,
        category = null,
        description = null,
        technologies = [],
        project_url = null,
        repository_url = null,
        display_order = 0,
        is_visible = true,
      } = req.body;

      const result = await db.query(
        `
          UPDATE projects
          SET
            title = $1,
            category = $2,
            description = $3,
            technologies = $4::jsonb,
            project_url = $5,
            repository_url = $6,
            display_order = $7,
            is_visible = $8,
            updated_at = NOW()
          WHERE id = $9
          RETURNING
            id,
            title,
            category,
            description,
            technologies,
            project_url,
            repository_url,
            display_order,
            is_visible,
            created_at,
            updated_at
        `,
        [
          title,
          category,
          description,
          JSON.stringify(technologies),
          project_url,
          repository_url,
          display_order,
          is_visible,
          projectId,
        ]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Project not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Project updated successfully.",
        project: result.rows[0],
      });
    } catch (error) {
      console.error("Update project error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to update project.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| Admin - Delete Project
|--------------------------------------------------------------------------
*/

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    const result = await db.query(
      `
        DELETE FROM projects
        WHERE id = $1
        RETURNING id
      `,
      [projectId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete project.",
    });
  }
});

module.exports = router;
