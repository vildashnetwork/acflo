"use strict";

const { Router } = require("express");
const { dbState } = require("../config/db");
const contentRoutes = require("./content");
const mediaRoutes = require("./media");
const messageRoutes = require("./messages");

const router = Router();

// GET /api/health — service + database status.
router.get("/health", (req, res) => {
  const db = dbState();
  res.status(db === "connected" ? 200 : 503).json({
    status: db === "connected" ? "ok" : "degraded",
    db,
    uptime: Math.round(process.uptime()),
    time: new Date().toISOString(),
  });
});

router.use("/content", contentRoutes);
router.use("/media", mediaRoutes);
router.use("/messages", messageRoutes);

module.exports = router;