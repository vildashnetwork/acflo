"use strict";

const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET in backend/.env");
  }
  return secret;
}

function signToken(admin) {
  return jwt.sign({ sub: admin.id, role: admin.role || "admin" }, jwtSecret(), {
    expiresIn: "7d",
  });
}

function extractToken(req) {
  const header = req.get("authorization") || "";
  if (header.toLowerCase().startsWith("bearer ")) return header.slice(7).trim();
  return req.query.token || null;
}

/**
 * Legacy static-token guard (kept for compatibility).
 * If API_TOKEN is set in backend/.env, requests must send it in the
 * `x-api-token` header (or `?api_token=` query).
 */
function requireApiToken(req, res, next) {
  const token = process.env.API_TOKEN;
  if (!token) return next();

  const provided = req.get("x-api-token") || req.query.api_token || "";
  if (provided !== token) {
    return res.status(401).json({ error: "Missing or invalid x-api-token" });
  }
  next();
}

/** Requires a valid admin JWT (Authorization: Bearer <token>). */
async function requireAuth(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ error: "Authentication required" });

    const payload = jwt.verify(token, jwtSecret());
    const admin = await Admin.findById(payload.sub);
    if (!admin) return res.status(401).json({ error: "Account no longer exists" });

    req.admin = admin;
    next();
  } catch (err) {
    if (res.headersSent) return next(err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Allows requests authenticated either by admin JWT (dashboard) or by the
 * static API_TOKEN header (scripts/integrations). API_TOKEN is optional —
 * when it is not set, a valid admin token is always required.
 */
async function requireAdminOrToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  if (apiToken) {
    const provided = req.get("x-api-token") || req.query.api_token || "";
    if (provided === apiToken) return next();
  }
  return requireAuth(req, res, next);
}

module.exports = { signToken, requireApiToken, requireAuth, requireAdminOrToken };