"use strict";

const mongoose = require("mongoose");
const Message = require("../models/Message");
const { messageSchema } = require("../utils/validate");
const { MESSAGE_TYPES } = require("../models/const");

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

/**
 * POST /api/messages — public endpoint for contact/join/newsletter forms.
 * Body: { type, name, email, subject, message, organization, country, phone, meta }
 */
async function createMessage(req, res, next) {
  try {
    const payload = messageSchema.parse({ ...req.body });
    const doc = await Message.create(payload);
    res.status(201).json(doc.toJSON());
  } catch (err) {
    next(err);
  }
}

/** GET /api/messages?type=&page=&limit=&unhandled=true */
async function listMessages(req, res, next) {
  try {
    const filter = {};
    if (req.query.type) {
      if (!MESSAGE_TYPES.includes(req.query.type)) throw badRequest(`type must be one of: ${MESSAGE_TYPES.join(", ")}`);
      filter.type = req.query.type;
    }
    if (req.query.handled === "false") filter.handled = false;
    if (req.query.handled === "true") filter.handled = true;

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 50));

    const [items, total] = await Promise.all([
      Message.find(filter).sort({ created_at: -1 }).skip((page - 1) * limit).limit(limit),
      Message.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
      limit,
    });
  } catch (err) {
    next(err);
  }
}

/** PATCH /api/messages/:id — mark handled: true/false. */
async function updateMessage(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw badRequest("Invalid message id");

    const doc = await Message.findById(id);
    if (!doc) throw notFound("Message not found");

    if (typeof req.body.handled === "boolean") doc.handled = req.body.handled;
    await doc.save();
    res.json(doc.toJSON());
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/messages/:id */
async function deleteMessage(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw badRequest("Invalid message id");

    const doc = await Message.findByIdAndDelete(id);
    if (!doc) throw notFound("Message not found");
    res.json({ ok: true, id: doc.id });
  } catch (err) {
    next(err);
  }
}

module.exports = { createMessage, listMessages, updateMessage, deleteMessage };