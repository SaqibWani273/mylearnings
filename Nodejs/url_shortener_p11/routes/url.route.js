const express = require("express");
const router = express.Router();

const { nanoid } = require("nanoid");

const db = require("../src/index");
const { urlsTable } = require("../src/db/models");
const { ensureAuthMiddleware } = require("../middleware/auth.middleware");
const { shortenRequestSchema } = require("../validations/request.validations");
const { eq, and } = require("drizzle-orm");

router.post("/shortenUrl", ensureAuthMiddleware, async (req, res) => {
  const validationResult = await shortenRequestSchema.safeParseAsync(req.body);

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.flatten() });
  }

  const { shortUrl, url } = validationResult.data;

  const [data] = await db
    .insert(urlsTable)
    .values({
      shortUrl: shortUrl ?? nanoid(10),
      targetUrl: url,
      userId: req.user.id,
    })
    .returning();
  return res.status(201).json({
    message: "Short URL created",
    data,
  });
});
router.get("/:shortUrl", async (req, res) => {
  const shortUrl = req.params.shortUrl;
  const [urlData] = await db
    .select({
      targetUrl: urlsTable.targetUrl,
    })
    .from(urlsTable)
    .where(eq(urlsTable.shortUrl, shortUrl));
  if (!urlData)
    return res.status(404).json({
      error: "url not found",
    });
  return res.redirect(urlData.targetUrl);
});
router.delete("/:id", ensureAuthMiddleware, async (req, res) => {
  try {
    const result = await db
      .delete(urlsTable)
      .where(
        and(
          eq(urlsTable.shortUrl, req.params.id),
          eq(urlsTable.userId, req.user.id),
        ),
      );
    console.log(result);
    if (result.rowCount !== 0) {
      return res.status(200).json({
        message: "Deleted successfully",
      });
    }
    return res.status(404).json({
      message: "Deletion Failed",
    });
  } catch (_) {
    return res.status(500).json({
      message: "Error in deleting ",
    });
  }
});

module.exports = router;
