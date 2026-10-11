"use strict";

/**
 * Optional API token protection.
 * If API_TOKEN is set in backend/.env, mutating requests must send
 * the value in the `x-api-token` header (or `?api_token=` query).
 * When API_TOKEN is not set the API stays open (dev mode).
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

module.exports = { requireApiToken };