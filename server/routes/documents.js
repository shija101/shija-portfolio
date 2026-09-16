const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const db = require("../config/database");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

const PRIVATE_DOCUMENTS_DIR = path.resolve(
  __dirname,
  "../private-documents"
);

fs.mkdirSync(PRIVATE_DOCUMENTS_DIR, { recursive: true });

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PRIVATE_DOCUMENTS_DIR);
  },

  filename: (req, file, cb) => {
    const originalName = path
      .basename(file.originalname)
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    const safeName = originalName || "document";

    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(
        new Error("Only PDF, JPEG, PNG and WEBP files are allowed.")
      );
    }

    cb(null, true);
  },
});

function getSafeDocumentPath(filePath) {
  const privateRoot = path.resolve(PRIVATE_DOCUMENTS_DIR);
  const requestedPath = path.resolve(filePath);

  if (
    requestedPath !== privateRoot &&
    !requestedPath.startsWith(`${privateRoot}${path.sep}`)
  ) {
    return null;
  }

  return requestedPath;
}

/*
|--------------------------------------------------------------------------
| GET /api/documents
| Admin - Get protected document metadata
|--------------------------------------------------------------------------
*/

router.get("/", requireAdmin, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT
         id,
         title,
         document_type,
         mime_type,
         file_size,
         is_public,
         created_at,
         updated_at
       FROM documents
       ORDER BY created_at DESC`
    );

    return res.status(200).json({
      success: true,
      documents: result.rows,
    });
  } catch (error) {
    console.error("Documents fetch error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve documents.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| POST /api/documents
| Admin - Upload protected document
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  requireAdmin,
  upload.single("document"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select a document to upload.",
        });
      }

      const title = String(req.body.title || "").trim();
      const documentType = String(
        req.body.document_type || ""
      ).trim();

      if (!title) {
        fs.unlinkSync(req.file.path);

        return res.status(400).json({
          success: false,
          message: "Document title is required.",
        });
      }

      if (title.length > 255) {
        fs.unlinkSync(req.file.path);

        return res.status(400).json({
          success: false,
          message: "Document title is too long.",
        });
      }

      if (!documentType) {
        fs.unlinkSync(req.file.path);

        return res.status(400).json({
          success: false,
          message: "Document type is required.",
        });
      }

      if (documentType.length > 100) {
        fs.unlinkSync(req.file.path);

        return res.status(400).json({
          success: false,
          message: "Document type is too long.",
        });
      }

      const result = await db.query(
        `INSERT INTO documents (
          title,
          document_type,
          file_path,
          mime_type,
          file_size,
          is_public
        )
        VALUES ($1, $2, $3, $4, $5, false)
        RETURNING
          id,
          title,
          document_type,
          mime_type,
          file_size,
          is_public,
          created_at,
          updated_at`,
        [
          title,
          documentType,
          req.file.path,
          req.file.mimetype,
          req.file.size,
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Document uploaded successfully.",
        document: result.rows[0],
      });
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      console.error("Document upload error:", error);

      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File is too large. Maximum size is 10 MB.",
          });
        }

        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      if (
        error.message ===
        "Only PDF, JPEG, PNG and WEBP files are allowed."
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Unable to upload document.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| GET /api/documents/:id/download
| Admin - Download protected document
|--------------------------------------------------------------------------
*/

router.get("/:id/download", requireAdmin, async (req, res) => {
  try {
    const documentId = Number(req.params.id);

    if (!Number.isSafeInteger(documentId) || documentId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID.",
      });
    }

    const result = await db.query(
      `SELECT
         id,
         title,
         file_path,
         mime_type
       FROM documents
       WHERE id = $1
       LIMIT 1`,
      [documentId]
    );

    const document = result.rows[0];

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    const requestedPath = getSafeDocumentPath(document.file_path);

    if (!requestedPath) {
      console.error(
        "Blocked unsafe document path:",
        document.id
      );

      return res.status(403).json({
        success: false,
        message: "Access to this document is not allowed.",
      });
    }

    if (!fs.existsSync(requestedPath)) {
      return res.status(404).json({
        success: false,
        message: "Document file not found.",
      });
    }

    res.setHeader(
      "Content-Type",
      document.mime_type || "application/octet-stream"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${path.basename(requestedPath)}"`
    );

    return fs.createReadStream(requestedPath).pipe(res);
  } catch (error) {
    console.error("Document download error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to download document.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| DELETE /api/documents/:id
| Admin - Delete protected document
|--------------------------------------------------------------------------
*/

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const documentId = Number(req.params.id);

    if (!Number.isSafeInteger(documentId) || documentId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID.",
      });
    }

    const existing = await db.query(
      `SELECT
         id,
         file_path
       FROM documents
       WHERE id = $1
       LIMIT 1`,
      [documentId]
    );

    const document = existing.rows[0];

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    const requestedPath = getSafeDocumentPath(
      document.file_path
    );

    if (!requestedPath) {
      console.error(
        "Blocked unsafe document delete path:",
        document.id
      );

      return res.status(403).json({
        success: false,
        message: "Access to this document is not allowed.",
      });
    }

    await db.query(
      `DELETE FROM documents
       WHERE id = $1`,
      [documentId]
    );

    if (fs.existsSync(requestedPath)) {
      fs.unlinkSync(requestedPath);
    }

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully.",
    });
  } catch (error) {
    console.error("Document delete error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete document.",
    });
  }
});

module.exports = router;
