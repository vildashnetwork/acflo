"use strict";

const { Router } = require("express");
const { requireAdminOrToken } = require("../middleware/auth");
const {
  createMessage,
  listMessages,
  updateMessage,
  deleteMessage,
} = require("../controllers/messageController");

const router = Router();

// Public: forms on the frontend can always post messages.
router.post("/", createMessage);

// Admin: reading/managing messages requires a signed-in admin.
router.get("/", requireAdminOrToken, listMessages);
router.patch("/:id", requireAdminOrToken, updateMessage);
router.delete("/:id", requireAdminOrToken, deleteMessage);

module.exports = router;