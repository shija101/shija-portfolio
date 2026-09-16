const express = require("express");
const path = require("path");
const fs = require("fs");
const db = require("../config/database");

const router = express.Router();

const PUBLIC_DOCUMENTS_DIR = path.resolve(
  __dirname,
  "../public-documents"
);

/*
|--------------------------------------------------------------------------
| Helper - Safely Send Public Document
|--------------------------------------------------------------------------
*/

const sendPublicDocument = async (
  req,
  res,
  table,
  id,
  routeName
) => {
  const result = await db.query(
    `SELECT
      id,
      certificate_path
     FROM ${table}
     WHERE id = $1
       AND is_visible = true
       AND certificate_path IS NOT NULL
       AND certificate_path <> ''
     LIMIT 1`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: `Public ${routeName} certificate not found`,
    });
  }

  const certificate = result.rows[0];

  const relativePath = certificate.certificate_path.replace(
    /^[/\\]+/,
    ""
  );

  const filePath = path.resolve(
    PUBLIC_DOCUMENTS_DIR,
    relativePath
  );

  const publicRootWithSeparator =
    PUBLIC_DOCUMENTS_DIR.endsWith(path.sep)
      ? PUBLIC_DOCUMENTS_DIR
      : PUBLIC_DOCUMENTS_DIR + path.sep;

  if (
    filePath !== PUBLIC_DOCUMENTS_DIR &&
    !filePath.startsWith(publicRootWithSeparator)
  ) {
    return res.status(403).json({
      success: false,
      message: "Invalid certificate path",
    });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: "Certificate file not found",
    });
  }

  const stat = fs.statSync(filePath);

  if (!stat.isFile()) {
    return res.status(404).json({
      success: false,
      message: "Certificate file not found",
    });
  }

  res.setHeader(
    "Content-Disposition",
    `inline; filename="${path
      .basename(filePath)
      .replace(/"/g, "")}"`
  );

  return res.sendFile(filePath);
};

/*
|--------------------------------------------------------------------------
| PUBLIC - View Certification Certificate
|--------------------------------------------------------------------------
*/

router.get("/certificates/:id", async (req, res, next) => {
  try {
    return await sendPublicDocument(
      req,
      res,
      "certifications",
      req.params.id,
      "certification"
    );
  } catch (error) {
    next(error);
  }
});

/*
|--------------------------------------------------------------------------
| PUBLIC - View Education Certificate
|--------------------------------------------------------------------------
*/

router.get(
  "/education-certificates/:id",
  async (req, res, next) => {
    try {
      return await sendPublicDocument(
        req,
        res,
        "education",
        req.params.id,
        "education"
      );
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
