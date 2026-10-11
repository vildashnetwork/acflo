"use strict";

function slugify(value) {
  const slug = String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "")
    .slice(0, 90);
  return slug || "item";
}

/**
 * Build a slug from base and guarantee it is unique within the given kind.
 * Returns e.g. "annual-summit" or "annual-summit-2".
 */
async function uniqueSlug(Model, base, kind, excludeId = null) {
  const root = slugify(base);
  let candidate = root;
  let n = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { kind, slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Model.exists(query);
    if (!exists) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

module.exports = { slugify, uniqueSlug };