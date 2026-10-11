"use strict";

const dns = require("dns");
const mongoose = require("mongoose");

// Some machines (e.g. behind Cloudflare WARP / local DNS proxies) refuse
// c-ares SRV queries on the default resolver. These public resolvers are
// used as a fallback so mongodb+srv:// URIs still work.
const FALLBACK_DNS = ["1.1.1.1", "8.8.8.8"];

function resolveWithFallback(method, name) {
  return new Promise((resolve, reject) => {
    const tryNext = (index) => {
      if (index >= FALLBACK_DNS.length) {
        // Last resort: default resolver (works on normal networks).
        return dns[method](name, (err, result) => (err ? reject(err) : resolve(result)));
      }
      const resolver = new dns.Resolver();
      resolver.setServers([FALLBACK_DNS[index]]);
      resolver[method](name, (err, result) => {
        if (err) return tryNext(index + 1);
        resolve(result);
      });
    };
    tryNext(0);
  });
}

function parseSrvUri(uri) {
  const withoutScheme = uri.replace(/^mongodb\+srv:\/\//, "");
  const authAndRest = withoutScheme.split("@");
  const rest = authAndRest.length > 1 ? authAndRest.slice(1).join("@") : withoutScheme;
  const auth = authAndRest.length > 1 ? authAndRest[0] + "@" : "";
  const [hostPart, query = ""] = rest.split("?");
  const slashIdx = hostPart.indexOf("/");
  const dbName = slashIdx >= 0 ? hostPart.slice(slashIdx + 1) : "";
  const host = slashIdx >= 0 ? hostPart.slice(0, slashIdx) : hostPart;
  return { auth, host, dbName, query };
}

/**
 * Convert mongodb+srv://... into a plain mongodb:// URI by resolving SRV/TXT
 * records ourselves, then let the driver connect directly (it resolves A
 * records through the OS, which works even when c-ares SRV does not).
 */
async function toDirectUri(uri) {
  if (!uri.startsWith("mongodb+srv://")) return uri;

  const { auth, host, dbName, query } = parseSrvUri(uri);

  const records = await resolveWithFallback("resolveSrv", `_mongodb._tcp.${host}`);
  if (!records || !records.length) throw new Error("SRV lookup returned no records");

  // dns.resolveSrv returns { name, port, priority, weight }
  const addresses = records.map((r) => `${r.name || r.hostname}:${r.port || 27017}`).join(",");

  // TXT carries replicaSet / authSource for Atlas clusters.
  const txtParams = [];
  try {
    const txt = await resolveWithFallback("resolveTxt", host);
    const flat = (txt || []).map((chunk) => (Array.isArray(chunk) ? chunk.join(" ") : chunk)).join(" ");
    for (const pair of flat.split(/[\s&]+/)) {
      if (pair.includes("=")) txtParams.push(pair);
    }
  } catch (_) {
    // TXT is optional — continue without it.
  }

  const params = new Map();
  for (const pair of [...txtParams, ...query.split("&")]) {
    if (!pair) continue;
    const [k, ...v] = pair.split("=");
    if (k && v.length && !params.has(k)) params.set(k, v.join("="));
  }
  if (!params.has("ssl")) params.set("ssl", "true");

  const qs = [...params.entries()].map(([k, v]) => `${k}=${v}`).join("&");
  const db = dbName ? `/${dbName}` : "";
  return `mongodb://${auth}${addresses}${db}${qs ? `?${qs}` : ""}`;
}

/**
 * Connect to MongoDB using MONGOURI from backend/.env,
 * falling back to MONGOURIOFFLINE when MONGOURI is not set.
 */
async function connectDB() {
  const raw = process.env.MONGOURI || process.env.MONGOURIOFFLINE;
  if (!raw) {
    throw new Error("Missing MONGOURI (or MONGOURIOFFLINE) in backend/.env");
  }

  mongoose.set("strictQuery", true);

  const uri = await toDirectUri(raw);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
  });

  return mongoose.connection;
}

function dbState() {
  // mongoose.connection.readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  return states[mongoose.connection.readyState] || "unknown";
}

module.exports = { connectDB, dbState, toDirectUri };