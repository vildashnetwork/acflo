"use strict";

const mongoose = require("mongoose");

const MESSAGE_TYPES = ["contact", "join", "newsletter", "other"];

const messageSchema = new mongoose.Schema(
  {
    type: { type: String, enum: MESSAGE_TYPES, default: "contact", index: true },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 320 },
    subject: { type: String, default: "", maxlength: 300 },
    message: { type: String, required: true, maxlength: 20000 },
    organization: { type: String, default: "", maxlength: 200 },
    country: { type: String, default: "", maxlength: 150 },
    phone: { type: String, default: "", maxlength: 50 },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    handled: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Message", messageSchema);
module.exports.MESSAGE_TYPES = MESSAGE_TYPES;