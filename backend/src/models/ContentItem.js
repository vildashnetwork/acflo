"use strict";

const mongoose = require("mongoose");

// The same kinds the frontend dashboard can publish (see frontend/src/lib/cms.ts).
const KINDS = ["news", "event", "gallery", "video", "partner", "organization", "resource"];

const contentItemSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      required: true,
      enum: KINDS,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 300 },
    // Unique per kind so /news/my-post and /event/my-post can both exist.
    slug: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    excerpt: { type: String, default: "", maxlength: 2000 },
    body: { type: String, default: "" },
    category: { type: String, default: "", maxlength: 150 },
    country: { type: String, default: "", maxlength: 150 },
    city: { type: String, default: "", maxlength: 150 },
    location: { type: String, default: "", maxlength: 200 },
    website: { type: String, default: null, maxlength: 500 },
    video_url: { type: String, default: null, maxlength: 2000 },
    file_url: { type: String, default: null, maxlength: 2000 },
    image_url: { type: String, default: null, maxlength: 2000 },
    // Cloudinary ids so uploaded assets can be replaced/removed later.
    image_public_id: { type: String, default: null },
    file_public_id: { type: String, default: null },
    event_date: { type: Date, default: null },
    published: { type: Boolean, default: true, index: true },
    author_id: { type: String, default: null },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  {
    // Match the frontend's Supabase column names (created_at / updated_at).
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: false },
  }
);

contentItemSchema.index({ kind: 1, slug: 1 }, { unique: true });
contentItemSchema.index({ title: "text", excerpt: "text", body: "text" });

module.exports = mongoose.model("ContentItem", contentItemSchema);
module.exports.KINDS = KINDS;