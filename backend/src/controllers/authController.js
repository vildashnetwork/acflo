"use strict";

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const { signToken } = require("../middleware/auth");
const { z } = require("zod");

const ROUNDS = 10;

const bootstrapSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(8).max(72),
  display_name: z.string().trim().max(100).optional(),
  organization: z.string().trim().max(150).optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(1).max(72),
});

function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

function defaultName(email) {
  const base = String(email).split("@")[0].replace(/[._-]+/g, " ").trim();
  return base ? base.replace(/\b\w/g, (c) => c.toUpperCase()) : "ACFLO Admin";
}

/** GET /api/auth/setup — does the first admin still need to be created? */
async function setupStatus(req, res, next) {
  try {
    const existing = await Admin.exists({});
    res.json({ needsSetup: !existing });
  } catch (err) {
    next(err);
  }
}

/** POST /api/auth/bootstrap — one-time creation of the very first admin. */
async function bootstrap(req, res, next) {
  try {
    const data = bootstrapSchema.parse({ ...req.body });

    const existing = await Admin.exists({});
    if (existing) {
      const err = new Error("An admin already exists. Please sign in instead.");
      err.status = 403;
      throw err;
    }

    const password_hash = await bcrypt.hash(data.password, ROUNDS);
    const admin = await Admin.create({
      email: data.email,
      password_hash,
      display_name: data.display_name || defaultName(data.email),
      organization: data.organization || "ACFLO",
    });

    res.status(201).json({ token: signToken(admin), admin: admin.toJSON() });
  } catch (err) {
    next(err);
  }
}

/** POST /api/auth/login */
async function login(req, res, next) {
  try {
    const data = loginSchema.parse({ ...req.body });

    const admin = await Admin.findOne({ email: data.email.toLowerCase() }).select("+password_hash");
    const ok = admin && (await bcrypt.compare(data.password, admin.password_hash));
    if (!ok) {
      const err = new Error("Invalid email or password");
      err.status = 401;
      throw err;
    }

    res.json({ token: signToken(admin), admin: admin.toJSON() });
  } catch (err) {
    next(err);
  }
}

/** GET /api/auth/me — current signed-in admin. */
async function me(req, res) {
  res.json({ admin: req.admin.toJSON() });
}

/** GET /api/auth/admins — public profile list (Partners page). */
async function listAdminsPublic(req, res, next) {
  try {
    const admins = await Admin.find()
      .select("display_name organization bio country website avatar_url created_at")
      .sort({ created_at: 1 })
      .lean();
    res.json({
      admins: admins.map((a) => ({
        id: String(a._id),
        display_name: a.display_name,
        organization: a.organization,
        bio: a.bio || "",
        country: a.country || "",
        website: a.website || "",
        avatar_url: a.avatar_url || "",
        created_at: a.created_at,
      })),
    });
  } catch (err) {
    next(err);
  }
}

/** POST /api/auth/admins — create an additional admin (admin session required). */
async function createAdmin(req, res, next) {
  try {
    const data = bootstrapSchema.parse({ ...req.body });

    const exists = await Admin.exists({ email: data.email.toLowerCase() });
    if (exists) {
      const err = new Error("An admin with this email already exists");
      err.status = 409;
      throw err;
    }

    const password_hash = await bcrypt.hash(data.password, ROUNDS);
    const admin = await Admin.create({
      email: data.email,
      password_hash,
      display_name: data.display_name || defaultName(data.email),
      organization: data.organization || "",
    });

    res.status(201).json({ admin: admin.toJSON() });
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/auth/admins/:id — remove another admin (never yourself). */
async function removeAdmin(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw badRequest("Invalid admin id");
    if (String(req.admin.id) === id) {
      const err = new Error("You cannot remove your own account");
      err.status = 400;
      throw err;
    }

    const removed = await Admin.findByIdAndDelete(id);
    if (!removed) {
      const err = new Error("Admin not found");
      err.status = 404;
      throw err;
    }
    res.json({ ok: true, id: removed.id });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  setupStatus,
  bootstrap,
  login,
  me,
  listAdminsPublic,
  createAdmin,
  removeAdmin,
};
