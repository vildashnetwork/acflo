"use strict";

const {
  uploadBuffer,
  destroyAsset,
  listAssets,
  BASE_FOLDER,
  isConfigured,
} = require("../config/cloudinary");
const { mediaFolder } = require("../utils/validate");

function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

/**
 * POST /api/media/upload  (multipart/form-data, field name: `file`)
 * Query/body: folder (optional, defaults to base folder), kind (optional —
 * uploads land in <base>/<kind>).
 * Returns { url, secure_url, public_id, ... }.
 */
async function uploadMedia(req, res, next) {
  try {
    if (!req.file) throw badRequest("Missing file (form field name must be 'file')");
    if (!isConfigured()) {
      const err = new Error("Cloudinary is not configured (missing credentials in backend/.env)");
      err.status = 503;
      throw err;
    }

    const folderInput = req.body.folder || req.query.folder;
    const kind = req.body.kind || req.query.kind;
    const folder = folderInput
      ? mediaFolder.parse(folderInput)
      : `${BASE_FOLDER}${kind ? `/${kind}` : ""}`;

    const result = await uploadBuffer(req.file.buffer, {
      folder: folder || BASE_FOLDER,
      filename: req.file.originalname,
      mimeType: req.file.mimetype || "",
    });

    res.status(201).json({
      url: result.secure_url || result.url,
      secure_url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      folder,
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/media?folder=&limit= — list uploaded assets. */
async function listMedia(req, res, next) {
  try {
    const folderInput = req.query.folder;
    const folder = folderInput ? mediaFolder.parse(folderInput) : BASE_FOLDER;
    const limit = Math.min(500, Math.max(1, parseInt(req.query.limit, 10) || 100));

    const resources = await listAssets({ folder, maxResults: limit });
    res.json({
      items: resources.map((r) => ({
        public_id: r.public_id,
        url: r.secure_url,
        format: r.format,
        size: r.bytes,
        width: r.width,
        height: r.height,
        created_at: r.created_at,
      })),
      folder,
      total: resources.length,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/media/:publicId  (publicId may be URL-encoded, e.g. acflo%2Fnews%2Fabc.jpg)
 * or DELETE /api/media?public_id=...
 */
async function deleteMedia(req, res, next) {
  try {
    const publicId = req.params.publicId || req.query.public_id;
    if (!publicId) throw badRequest("publicId is required");
    if (publicId.includes("..")) throw badRequest("Invalid publicId");

    const result = await destroyAsset(publicId);
    if (result === "not found" || result?.result === "not found") {
      const err = new Error("Asset not found");
      err.status = 404;
      throw err;
    }
    res.json({ ok: true, public_id: publicId });
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadMedia, listMedia, deleteMedia };