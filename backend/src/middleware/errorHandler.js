"use strict";

/* eslint-disable no-unused-vars */

// Central error handler — turns known error types into clean JSON responses.
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  // zod validation
  if (err?.name === "ZodError") {
    return res.status(400).json({
      error: "Validation failed",
      details: (err.issues || []).map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
  }

  // mongoose duplicate key
  if (err?.code === 11000) {
    return res.status(409).json({
      error: "Duplicate value for a unique field",
      details: err.keyValue || err.keyPattern || null,
    });
  }

  // mongoose validation
  if (err?.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation failed",
      details: Object.values(err.errors || {}).map((e) => e.message),
    });
  }

  // multer (upload) errors
  if (err?.name === "MulterError") {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }

  if (err?.type === "entity.too.large") {
    return res.status(413).json({ error: "Request body too large" });
  }

  const status = err?.status || err?.statusCode || 500;
  if (status >= 500) console.error("[api error]", err);
  res.status(status).json({ error: err?.message || "Internal server error" });
}

module.exports = { errorHandler };