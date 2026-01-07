require("dotenv/config");
// import { drizzle } from "drizzle-orm/node-postgres";
const { drizzle } = require("drizzle-orm/node-postgres");
//postgres://<username>:<password>@<host>:<port>/<database>
const db = drizzle(process.env.DATABASE_URL);
module.exports = { db };
