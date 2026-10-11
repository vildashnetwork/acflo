"use strict";

const { Router } = require("express");
const { requireApiToken } = require("../middleware/auth");
const {
  createMessage,
  listMessages,
  updateMessage,
  deleteMessage,
} = require("../controllers/messageController");

const router = Router();

// Public: forms on the frontend can always post messages.
router.post("/", createMessage);

// Admin: reading/managing messages is protected when API_TOKEN is set.
router.get("/", requireApiToken, listMessages);
router.patch("/:id", requireApiToken, updateMessage);
router.delete("/:id", requireApiToken, deleteMessage);

module.exports = router;