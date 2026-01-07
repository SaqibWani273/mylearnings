const fs = require("node:fs");

exports.logger = function logger(req, res, next) {
  const logData = `\n${Date.now()} : ${req.method} | ${req.url}`;
  fs.appendFileSync("log.txt", logData, "utf-8");
  next();
};
