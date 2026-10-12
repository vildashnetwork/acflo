"use strict";

const { Router } = require("express");
const { requireAuth } = require("../middleware/auth");
const {
  setupStatus,
  bootstrap,
  login,
  me,
  listAdminsPublic,
  createAdmin,
  removeAdmin,
} = require("../controllers/authController");

const router = Router();

// Public — used by the auth page.
router.get("/setup", setupStatus);
router.post("/bootstrap", bootstrap);
router.post("/login", login);
router.get("/admins", listAdminsPublic);

// Signed-in admin.
router.get("/me", requireAuth, me);
router.post("/admins", requireAuth, createAdmin);
router.delete("/admins/:id", requireAuth, removeAdmin);

module.exports = router;