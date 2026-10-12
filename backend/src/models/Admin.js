"use strict";

const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 320,
    },
    // Never returned by queries or in JSON.
    password_hash: { type: String, required: true, select: false },
    display_name: { type: String, default: "", maxlength: 100 },
    organization: { type: String, default: "", maxlength: 150 },
    role: { type: String, enum: ["admin"], default: "admin" },
    // Optional public profile fields shown on the Partners page.
    bio: { type: String, default: "", maxlength: 500 },
    country: { type: String, default: "", maxlength: 150 },
    website: { type: String, default: "", maxlength: 500 },
    avatar_url: { type: String, default: "", maxlength: 2000 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password_hash;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Admin", adminSchema);