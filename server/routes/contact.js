const express = require("express");
const { body, validationResult } = require("express-validator");
const pool = require("../config/database");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

const submissionLog = new Map();

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 5;

const cleanupSubmissionLog = () => {
  const now = Date.now();

  for (const [ip, timestamps] of submissionLog.entries()) {
    const recent = timestamps.filter(
      (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
    );

    if (recent.length === 0) {
      submissionLog.delete(ip);
    } else {
      submissionLog.set(ip, recent);
    }
  }
};

const contactValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters."),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .isLength({ max: 255 })
    .withMessage("Email address is too long."),

  body("message")
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage("Message must be between 10 and 5000 characters."),
];

router.post("/", contactValidation, async (req, res, next) => {
  try {
    cleanupSubmissionLog();

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Please correct the submitted information.",
        errors: errors.array(),
      });
    }

    const ip =
      req.ip ||
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      "unknown";

    const now = Date.now();

    const timestamps = (submissionLog.get(ip) || []).filter(
      (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
    );

    if (timestamps.length >= RATE_LIMIT_MAX) {
      return res.status(429).json({
        success: false,
        message: "Too many messages submitted. Please try again later.",
      });
    }

    timestamps.push(now);
    submissionLog.set(ip, timestamps);

    const { name, email, message } = req.body;

    const result = await pool.query(
      `
        INSERT INTO contact_messages (name, email, message)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, message, status, created_at
      `,
      [name, email, message]
    );

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        email,
        message,
        status,
        created_at,
        updated_at
      FROM contact_messages
      ORDER BY created_at DESC, id DESC
    `);

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    return next(error);
  }
});

router.put(
  "/:id/status",
  requireAdmin,
  [
    body("status")
      .isIn(["new", "read", "archived"])
      .withMessage("Status must be new, read, or archived."),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Invalid status.",
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const { status } = req.body;

      const result = await pool.query(
        `
          UPDATE contact_messages
          SET
            status = $1,
            updated_at = NOW()
          WHERE id = $2
          RETURNING
            id,
            name,
            email,
            message,
            status,
            created_at,
            updated_at
        `,
        [status, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Contact message not found.",
        });
      }

      return res.json({
        success: true,
        message: "Message status updated successfully.",
        data: result.rows[0],
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
        DELETE FROM contact_messages
        WHERE id = $1
        RETURNING id
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.json({
      success: true,
      message: "Contact message deleted successfully.",
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
