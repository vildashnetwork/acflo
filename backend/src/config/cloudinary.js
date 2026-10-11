"use strict";

const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Base folder in your Cloudinary media library. CLOUDINARY_STUDENT_PHOTOS_FOLDER
// is used when present so uploads land in the folder you already configured.
const BASE_FOLDER = (process.env.CLOUDINARY_STUDENT_PHOTOS_FOLDER || "acflo").replace(/^\/+|\/+$/g, "");

const IMAGE_EXT_RE = /\.(jpe?g|png|gif|webp|svg|avif|bmp|ico|tiff|heic|heif)$/i;

function resourceTypeFor(name = "") {
  return IMAGE_EXT_RE.test(name) ? "image" : "raw";
}

function isConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

/**
 * Upload a Buffer to Cloudinary via upload_stream.
 * Images keep a readable filename; raw files (pdf, docx, zip...) keep their
 * extension inside public_id so Cloudinary serves them correctly.
 */
function uploadBuffer(buffer, { folder = BASE_FOLDER, filename = null, mimeType = "" } = {}) {
  if (!isConfigured()) {
    return Promise.reject(new Error("Cloudinary is not configured (missing credentials in .env)"));
  }

  const isImage = mimeType.startsWith("image/") || (filename && IMAGE_EXT_RE.test(filename));
  const resourceType = isImage ? "image" : "raw";

  const options = {};
  if (resourceType === "raw") {
    const safe = (filename || "file").replace(/[^a-zA-Z0-9._-]/g, "_");
    options.public_id = `${folder}/${safe}`;
  } else {
    options.folder = folder;
    if (filename) {
      const base = filename.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "image";
      options.use_filename = true;
      options.filename_override = base;
      options.unique_filename = true;
    }
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });
}

/** Remove an asset from Cloudinary by public_id. */
async function destroyAsset(publicId, resourceType) {
  if (!isConfigured()) return { result: "not configured" };

  // Image assets have no extension in public_id, raw assets usually do.
  // Unless the caller knows the type, try image first, then raw —
  // a wrong type simply returns "not found" (safe).
  const attempts = resourceType ? [resourceType] : ["image", "raw"];
  let last = { result: "not found" };

  for (const rt of attempts) {
    // eslint-disable-next-line no-await-in-loop
    last = await cloudinary.uploader.destroy(publicId, {
      resource_type: rt,
      invalidate: true,
    });
    if (last && last.result === "ok") return last;
  }
  return last;
}

/** List assets under a folder prefix. */
async function listAssets({ folder = BASE_FOLDER, maxResults = 100 } = {}) {
  if (!isConfigured()) throw new Error("Cloudinary is not configured (missing credentials in .env)");
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: `${folder.replace(/\/+$/, "")}/`,
      max_results: Math.min(500, maxResults),
    });
    return result.resources || [];
  } catch (err) {
    // Cloudinary returns 404 when a folder is still empty.
    if (err?.error?.http_code === 404 || err?.http_code === 404) return [];
    throw err;
  }
}

module.exports = {
  cloudinary,
  BASE_FOLDER,
  uploadBuffer,
  destroyAsset,
  listAssets,
  resourceTypeFor,
  isConfigured,
};