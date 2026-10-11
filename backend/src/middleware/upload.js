"use strict";

const multer = require("multer");

// Keep uploads in memory; they are streamed straight to Cloudinary.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB per file
    files: 4,
  },
});

module.exports = upload;