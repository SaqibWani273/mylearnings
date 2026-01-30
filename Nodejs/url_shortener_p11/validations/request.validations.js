const { z } = require("zod");

const registerRequestSchema = z.object({
  firstname: z.string(),
  lastname: z.string().optional(),
  age: z.number().optional(),
  email: z.email(),
  password: z.string().min(3),
});
module.exports = {
  registerRequestSchema,
};
