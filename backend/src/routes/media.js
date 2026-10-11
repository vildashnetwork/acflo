"use strict";

const { Router } = require("express");
const upload = require("../middleware/upload");
const { requireApiToken } = require("../middleware/auth");
const { uploadMedia, listMedia, deleteMedia } = require("../controllers/mediaController");

const router = Router();

router.post("/upload", requireApiToken, upload.single("file"), uploadMedia);
router.get("/", listMedia);
router.delete("/:publicId", requireApiToken, deleteMedia);
router.delete("/", requireApiToken, deleteMedia);

module.exports = router;