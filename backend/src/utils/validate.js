"use strict";

const { z } = require("zod");
const { KINDS, MESSAGE_TYPES } = require("../models/const");

const emptyToNull = (v) => (v === "" || v === undefined ? null : v);

const text = (max, { required = false } = {}) => {
  let s = z.string().max(max);
  if (required) s = s.trim().min(1, "is required");
  else s = s.optional().default("");
  return s;
};

const nullableUrl = (max = 2000) => z.preprocess(emptyToNull, z.string().max(max).nullable().optional());

const eventDate = z.preprocess(
  (v) => (v === "" || v === undefined || v === null || v === "null" ? null : v),
  z.union([z.string().max(40), z.date(), z.null()]).optional()
);

const publishedFlag = z.preprocess((v) => {
  if (v === "true" || v === true) return true;
  if (v === "false" || v === false) return false;
  if (v === "" || v === undefined) return undefined;
  return v;
}, z.boolean().optional().default(true));

const authorId = z.preprocess(emptyToNull, z.string().max(200).nullable().optional());

// Fields the frontend dashboard posts (see dashboard.tsx PostForm).
const contentShape = {
  title: text(300, { required: true }),
  slug: z.string().trim().max(120).optional(),
  excerpt: text(2000),
  body: z.string().max(500000).optional().default(""),
  category: text(150),
  country: text(150),
  city: text(150),
  location: text(200),
  website: nullableUrl(500),
  video_url: nullableUrl(),
  file_url: nullableUrl(),
  image_url: nullableUrl(),
  event_date: eventDate,
  published: publishedFlag,
  author_id: authorId,
  meta: z.record(z.any()).optional(),
};

const contentCreateSchema = z.object({
  kind: z.enum(KINDS),
  ...contentShape,
});

const contentUpdateSchema = z.object({
  kind: z.enum(KINDS).optional(),
  ...contentShape,
})
  .partial()
  .extend({ title: z.string().trim().min(1).max(300).optional() });

const messageSchema = z.object({
  type: z.enum(MESSAGE_TYPES).optional().default("contact"),
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  subject: text(300),
  message: z.string().trim().min(1, "is required").max(20000),
  organization: text(200),
  country: text(150),
  phone: text(50),
  meta: z.record(z.any()).optional(),
});

const mediaFolder = z
  .string()
  .max(200)
  .regex(/^[a-zA-Z0-9/_-]*$/, "folder may only contain letters, numbers, /, _ and -")
  .refine((s) => !s.includes(".."), "folder may not contain ..")
  .optional();

module.exports = {
  contentCreateSchema,
  contentUpdateSchema,
  messageSchema,
  mediaFolder,
  KINDS,
};