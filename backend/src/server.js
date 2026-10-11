"use strict";

require("./config/env"); // must be first — loads backend/.env

const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = parseInt(process.env.PORT, 10) || 5000;

connectDB()
  .then(() => {
    console.log("[db] MongoDB connected");
    app.listen(PORT, () => {
      console.log(`[api] ACFLO backend listening on http://localhost:${PORT}`);
      console.log(`[api] Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error("[db] MongoDB connection failed:", err.message);
    process.exit(1);
  });

process.on("unhandledRejection", (err) => {
  console.error("[fatal] unhandled rejection:", err);
});