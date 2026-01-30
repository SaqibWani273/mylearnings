const crypto = require("crypto");

const hashedPassword = (password, currentSalt = undefined) => {
  const salt = currentSalt ?? crypto.randomBytes(16).toString("hex");
  const hashedpw = crypto
    .createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  return { hashedpw, salt };
};
module.exports = {
  hashedPassword,
};
