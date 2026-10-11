"use strict";

const mongoose = require("mongoose");
const ContentItem = require("../models/ContentItem");
const { KINDS } = require("../models/const");
const { contentCreateSchema, contentUpdateSchema } = require("../utils/validate");
const { uniqueSlug } = require("../utils/slugify");
const { uploadBuffer, destroyAsset, BASE_FOLDER } = require("../config/cloudinary");

const SORTS = {
  "-created_at": { created_at: -1 },
  created_at: { created_at: 1 },
  title: { title: 1 },
  "-title": { title: -1 },
  event_date: { event_date: 1 },
  "-event_date": { event_date: -1 },
};

function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

function notFound(message = "Not found") {
  const err = new Error(message);
  err.status = 404;
  return err;
}

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function uploadedFile(req, field) {
  const entry = req.files && req.files[field];
  return Array.isArray(entry) && entry.length ? entry[0] : null;
}

/** Upload one multer file to Cloudinary under the content item's folder. */
async function uploadToCloudinary(file, folder) {
  const result = await uploadBuffer(file.buffer, {
    folder,
    filename: file.originalname,
    mimeType: file.mimetype || "",
  });
  return { url: result.secure_url || result.url, public_id: result.public_id };
}

/**
 * GET /api/content
 * Query: kind, published=true|false, search, country, page, limit, sort
 * Returns { items, total, page, pages, limit } — same item shape as the frontend.
 */
async function listContent(req, res, next) {
  try {
    const filter = {};

    if (req.query.kind !== undefined) {
      if (Array.isArray(req.query.kind) || !KINDS.includes(req.query.kind)) {
        throw badRequest(`kind must be one of: ${KINDS.join(", ")}`);
      }
      filter.kind = req.query.kind;
    }

    if (req.query.published !== undefined) {
      filter.published = req.query.published === "true" || req.query.published === "1";
    }

    if (req.query.country) {
      filter.country = new RegExp(`^${escapeRegex(req.query.country)}$`, "i");
    }

    if (req.query.search) {
      const rx = new RegExp(escapeRegex(req.query.search), "i");
      filter.$or = [{ title: rx }, { excerpt: rx }, { body: rx }, { category: rx }];
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 50));
    const sort = SORTS[req.query.sort] || SORTS["-created_at"];

    const [items, total] = await Promise.all([
      ContentItem.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
      ContentItem.countDocuments(filter),
    ]);

    res.json({ items: items.map(publicItem), total, page, pages: Math.max(1, Math.ceil(total / limit)), limit });
  } catch (err) {
    next(err);
  }
}

/** GET /api/content/kinds — discoverable list of supported kinds. */
async function listKinds(req, res) {
  res.json({ kinds: KINDS });
}

/**
 * GET /api/content/:id
 * Accepts a Mongo ObjectId or a bare slug (searched across kinds).
 */
async function getContent(req, res, next) {
  try {
    const { id } = req.params;

    if (mongoose.isValidObjectId(id)) {
      const item = await ContentItem.findById(id).lean();
      if (item) return res.json(publicItem(item));
    }

    const item = await ContentItem.findOne({ slug: id.toLowerCase() })
      .sort({ created_at: -1 })
      .lean();
    if (!item) throw notFound("Content not found");
    res.json(publicItem(item));
  } catch (err) {
    next(err);
  }
}

/** Convert a lean() doc (with _id) to the frontend's flat item shape (id). */
function publicItem(doc) {
  if (!doc) return doc;
  const out = { ...doc, id: String(doc._id) };
  delete out._id;
  delete out.__v;
  return out;
}

/** GET /api/content/:kind/:slug — same lookup the frontend uses per page. */
async function getContentBySlug(req, res, next) {
  try {
    const { kind, slug } = req.params;
    if (!KINDS.includes(kind)) throw notFound("Unknown content kind");

    const item = await ContentItem.findOne({ kind, slug: slug.toLowerCase() }).lean();
    if (!item) throw notFound("Content not found");
    res.json(publicItem(item));
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/content
 * Accepts JSON, or multipart/form-data with optional `image` and `file`
 * uploads (stored on Cloudinary; image_url/file_url are filled in).
 */
async function createContent(req, res, next) {
  try {
    const payload = contentCreateSchema.parse({ ...req.body });

    let image_url = payload.image_url ?? null;
    let file_url = payload.file_url ?? null;
    let image_public_id = null;
    let file_public_id = null;

    const imageFile = uploadedFile(req, "image");
    const dataFile = uploadedFile(req, "file");

    if (imageFile) {
      const up = await uploadToCloudinary(imageFile, `${BASE_FOLDER}/${payload.kind}`);
      image_url = up.url;
      image_public_id = up.public_id;
    }
    if (dataFile) {
      const up = await uploadToCloudinary(dataFile, `${BASE_FOLDER}/${payload.kind}`);
      file_url = up.url;
      file_public_id = up.public_id;
    }

    const slug = await uniqueSlug(ContentItem, payload.slug || payload.title, payload.kind);

    const doc = await ContentItem.create({
      ...payload,
      slug,
      image_url,
      file_url,
      image_public_id,
      file_public_id,
      meta: payload.meta || {},
    });

    res.status(201).json(doc.toJSON());
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/content/:id
 * Partial update. Re-uploading `image`/`file` (multipart) replaces the
 * previous Cloudinary asset when its public_id is known. The slug is kept
 * stable on rename so published links never break.
 */
async function updateContent(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw badRequest("Invalid content id");

    const existing = await ContentItem.findById(id);
    if (!existing) throw notFound("Content not found");

    const payload = contentUpdateSchema.parse({ ...req.body });
    const kind = payload.kind || existing.kind;

    // An explicit new slug must be non-empty; otherwise keep the current one.
    if (!payload.slug) delete payload.slug;
    else payload.slug = payload.slug.toLowerCase();

    const imageFile = uploadedFile(req, "image");
    const dataFile = uploadedFile(req, "file");

    if (imageFile) {
      if (existing.image_public_id) await destroyAsset(existing.image_public_id).catch(() => {});
      const up = await uploadToCloudinary(imageFile, `${BASE_FOLDER}/${kind}`);
      payload.image_url = up.url;
      payload.image_public_id = up.public_id;
    }

    if (dataFile) {
      if (existing.file_public_id) await destroyAsset(existing.file_public_id).catch(() => {});
      const up = await uploadToCloudinary(dataFile, `${BASE_FOLDER}/${kind}`);
      payload.file_url = up.url;
      payload.file_public_id = up.public_id;
    }

    // Apply only fields the client actually sent — omitted keys stay untouched.
    for (const [key, value] of Object.entries(payload)) {
      if (value !== undefined) existing.set(key, value);
    }
    await existing.save();

    res.json(existing.toJSON());
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/content/:id — also removes uploaded Cloudinary assets. */
async function deleteContent(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw badRequest("Invalid content id");

    const doc = await ContentItem.findById(id);
    if (!doc) throw notFound("Content not found");

    const cleanup = [];
    if (doc.image_public_id) cleanup.push(destroyAsset(doc.image_public_id).catch(() => {}));
    if (doc.file_public_id) cleanup.push(destroyAsset(doc.file_public_id).catch(() => {}));
    await Promise.all(cleanup);

    await doc.deleteOne();
    res.json({ ok: true, id: doc.id });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listContent,
  listKinds,
  getContent,
  getContentBySlug,
  createContent,
  updateContent,
  deleteContent,
};
