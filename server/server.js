require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const path = require("path");

const db = require("./config/database");
const { csrfSync } = require("csrf-sync");

const {
  generateToken,
  csrfSynchronisedProtection,
} = csrfSync({
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],

  getTokenFromRequest: (req) => {
    return req.headers["x-csrf-token"];
  },

  getTokenFromState: (req) => {
    return req.session.csrfToken;
  },

  storeTokenInState: (req, token) => {
    req.session.csrfToken = token;
  },
});

const authRoutes = require("./routes/auth");
const documentsRoutes = require("./routes/documents");
const skillsRoutes = require("./routes/skills");
const experienceRoutes = require("./routes/experience");
const projectsRoutes = require("./routes/projects");
const educationRoutes = require("./routes/education");
const certificationsRoutes = require("./routes/certifications");
const profileRoutes = require("./routes/profile");
const publicFilesRoutes = require("./routes/publicFiles");
const professionalSkillsRoutes = require("./routes/professional-skills");
const contactRoutes = require("./routes/contact");
const languagesRoutes = require("./routes/languages");
const interestsRoutes = require("./routes/interests");
const aboutRoutes = require("./routes/about");

const app = express();

const PORT = Number(process.env.PORT) || 5000;

app.set("trust proxy", 1);

/*
|--------------------------------------------------------------------------
| Security Headers
|--------------------------------------------------------------------------
*/

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin:
      process.env.CLIENT_URL || "http://localhost:5174",

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-CSRF-Token",
    ],
  })
);

/*
|--------------------------------------------------------------------------
| Rate Limiting
|--------------------------------------------------------------------------
*/

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 300,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

/*
|--------------------------------------------------------------------------
| Request Body Parsers
|--------------------------------------------------------------------------
*/

app.use((req, res, next) => {
  if (req.is("multipart/form-data")) {
    return next();
  }

  return express.json({
    limit: "10kb",
  })(req, res, next);
});

app.use((req, res, next) => {
  if (req.is("multipart/form-data")) {
    return next();
  }

  return express.urlencoded({
    extended: false,
    limit: "10kb",
  })(req, res, next);
});

app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| Session
|--------------------------------------------------------------------------
*/

app.use(
  session({
    store: new pgSession({
      pool: db,
      tableName: "user_sessions",
      createTableIfMissing: false,
    }),

    name: "shija.sid",

    secret: (() => {
      if (!process.env.SESSION_SECRET) {
        throw new Error(
          "SESSION_SECRET is required. Set it in server/.env before starting the server."
        );
      }

      return process.env.SESSION_SECRET;
    })(),

    resave: false,

    saveUninitialized: false,

    cookie: {
      httpOnly: true,

      secure:
        process.env.NODE_ENV === "production",

      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",

      maxAge: 1000 * 60 * 60,
    },
  })
);

/*
|--------------------------------------------------------------------------
| Public Uploaded Files
|--------------------------------------------------------------------------
*/

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads"),
    {
      fallthrough: true,
      index: false,
      dotfiles: "deny",
      maxAge:
        process.env.NODE_ENV === "production"
          ? "7d"
          : 0,
    }
  )
);

/*
|--------------------------------------------------------------------------
| CSRF Token Endpoint
|--------------------------------------------------------------------------
*/

app.get("/api/auth/csrf-token", (req, res) => {
  try {
    const token = generateToken(req);

    return res.status(200).json({
      success: true,
      csrfToken: token,
    });
  } catch (error) {
    console.error(
      "CSRF token generation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to generate CSRF token.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| CSRF Protection
|--------------------------------------------------------------------------
*/

app.use(csrfSynchronisedProtection);

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");

    return res.status(200).json({
      success: true,
      status: "ok",
      service: "Shija Portfolio API",
      database: "connected",
    });
  } catch (error) {
    console.error(
      "Health check database error:",
      error
    );

    return res.status(503).json({
      success: false,
      status: "error",
      service: "Shija Portfolio API",
      database: "disconnected",
    });
  }
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRoutes);

app.use("/api/documents", documentsRoutes);

app.use("/api/skills", skillsRoutes);

app.use("/api/experience", experienceRoutes);

app.use("/api/projects", projectsRoutes);

app.use("/api/education", educationRoutes);

app.use("/api/certifications", certificationsRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/public-files", publicFilesRoutes);

app.use(
  "/api/professional-skills",
  professionalSkillsRoutes
);
app.use("/api/contact", contactRoutes);

app.use("/api/languages", languagesRoutes);

app.use("/api/interests", interestsRoutes);
app.use("/api/about", aboutRoutes);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use((error, req, res, next) => {
  console.error("Server error:", error);

  if (res.headersSent) {
    return next(error);
  }

  if (error.code === "EBADCSRFTOKEN") {
    return res.status(403).json({
      success: false,
      message: "Invalid CSRF token.",
      code: "EBADCSRFTOKEN",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

app.listen(PORT, () => {
  console.log(
    `Shija Portfolio API running on port ${PORT}`
  );

  console.log(
    `Environment: ${
      process.env.NODE_ENV || "development"
    }`
  );
});
