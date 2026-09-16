const express = require("express");

const {
  body,
  validationResult,
} = require("express-validator");

const db = require("../config/database");

const {
  verifyPassword,
} = require("../utils/password");

const {
  requireAuth,
  requireAdmin,
} = require("../middleware/auth");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| CSRF Token
|--------------------------------------------------------------------------
*/

router.get("/csrf-token", (req, res) => {
  try {
    const csrfToken = req.csrfToken();

    return res.status(200).json({
      success: true,
      csrfToken,
    });
  } catch (error) {
    console.error("CSRF token generation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to generate CSRF token.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email address.")
      .normalizeEmail(),

    body("password")
      .isString()
      .isLength({ min: 1 })
      .withMessage("Password is required."),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Invalid login data.",
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      const result = await db.query(
        `
          SELECT
            id,
            email,
            password_hash,
            role,
            is_active
          FROM users
          WHERE email = $1
          LIMIT 1
        `,
        [email]
      );

      const user = result.rows[0];

      if (!user || !user.is_active) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      const passwordValid = await verifyPassword(
        user.password_hash,
        password
      );

      if (!passwordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      req.session.regenerate((sessionError) => {
        if (sessionError) {
          console.error(
            "Session regeneration error:",
            sessionError
          );

          return res.status(500).json({
            success: false,
            message: "Internal server error.",
          });
        }

        req.session.user = {
          id: user.id,
          email: user.email,
          role: user.role,
        };

        let csrfToken;

        try {
          csrfToken = req.csrfToken();
        } catch (csrfError) {
          console.error(
            "CSRF token generation after login error:",
            csrfError
          );

          return res.status(500).json({
            success: false,
            message: "Unable to initialize security token.",
          });
        }

        return req.session.save((saveError) => {
          if (saveError) {
            console.error(
              "Session save error:",
              saveError
            );

            return res.status(500).json({
              success: false,
              message: "Internal server error.",
            });
          }

          return res.status(200).json({
            success: true,
            message: "Login successful.",
            user: req.session.user,
            csrfToken,
          });
        });
      });
    } catch (error) {
      console.error("Login error:", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

router.get("/me", (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated.",
    });
  }

  return res.status(200).json({
    success: true,
    user: req.session.user,
  });
});

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

router.post("/logout", (req, res, next) => {
  if (!req.session) {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  }

  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie("shija.sid");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  });
});

/*
|--------------------------------------------------------------------------
| Protected Test
|--------------------------------------------------------------------------
*/

router.get(
  "/protected-test",
  requireAuth,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Authenticated access granted.",
      user: req.session.user,
    });
  }
);

/*
|--------------------------------------------------------------------------
| Admin Test
|--------------------------------------------------------------------------
*/

router.get(
  "/admin-test",
  requireAdmin,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Admin access granted.",
      user: req.session.user,
    });
  }
);

module.exports = router;
