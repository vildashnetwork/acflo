"use strict";

const { Router } = require("express");
const upload = require("../middleware/upload");
const { requireApiToken } = require("../middleware/auth");
const {
  listContent,
  listKinds,
  getContent,
  getContentBySlug,
  createContent,
  updateContent,
  deleteContent,
} = require("../controllers/contentController");

const router = Router();

// Static paths first so they are not swallowed by /:id.
router.get("/kinds", listKinds);
router.get("/", listContent);
router.get("/:kind/:slug", getContentBySlug);
router.get("/:id", getContent);

// Create / update accept either JSON or multipart (image + file fields).
const fields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "file", maxCount: 1 },
]);

router.post("/", requireApiToken, fields, createContent);
router.put("/:id", requireApiToken, fields, updateContent);
router.delete("/:id", requireApiToken, deleteContent);

module.exports = router;