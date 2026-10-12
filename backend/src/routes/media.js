"use strict";

const { Router } = require("express");
const upload = require("../middleware/upload");
const { requireAdminOrToken } = require("../middleware/auth");
const { uploadMedia, listMedia, deleteMedia } = require("../controllers/mediaController");

const router = Router();

router.post("/upload", requireAdminOrToken, upload.single("file"), uploadMedia);
router.get("/", listMedia);
router.delete("/:publicId", requireAdminOrToken, deleteMedia);
router.delete("/", requireAdminOrToken, deleteMedia);

module.exports = router;