// import { defineConfig } from "drizzle-kit";
const { defineConfig } = require("drizzle-kit");
require("dotenv/config");
// dotenv.config();
const config = defineConfig({
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./src/db/schema.js",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
module.exports = config;
