const { z } = require("zod");

const registerRequestSchema = z.object({
  firstname: z.string(),
  lastname: z.string().optional(),
  age: z.number().optional(),
  email: z.email(),
  password: z.string().min(3),
});
const loginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(3),
});
const shortenRequestSchema = z.object({
  url: z.url(),
  shortUrl: z.string().optional(),
});
module.exports = {
  registerRequestSchema,
  loginRequestSchema,
  shortenRequestSchema,
};
