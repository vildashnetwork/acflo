"use strict";

// Load backend/.env into process.env before anything else reads it.
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

module.exports = {};