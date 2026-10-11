"use strict";

require("./config/env"); // must be first — loads backend/.env

const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// CORS: allows the frontend (dev server or deployed site) to call this API.
// Set CORS_ORIGIN in .env to a comma-separated list to restrict it.
const corsOrigin = process.env.CORS_ORIGIN;
app.use(
  cors({
    origin: corsOrigin ? corsOrigin.split(",").map((s) => s.trim()) : true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-api-token"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// GET / — API discovery.
app.get("/", (req, res) => {
  res.json({
    name: "ACFLO API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      content: "/api/content",
      contentKinds: "/api/content/kinds",
      contentBySlug: "/api/content/:kind/:slug",
      mediaUpload: "/api/media/upload (POST, multipart field: file)",
      mediaList: "/api/media",
      messages: "/api/messages (POST)",
    },
  });
});

app.use("/api", routes);

// 404 for unknown API routes.
app.use((req, res) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
});

app.use(errorHandler);

module.exports = app;