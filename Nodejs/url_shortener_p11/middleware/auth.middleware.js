const { validateToken } = require("../utils/user.utils");

function authenticationMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "It must start with Bearer" });
  }
  const token = authHeader.split(" ")[1];
  const decodedToken = validateToken(token);
  req.user = decodedToken;
  return next();
}
function ensureAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Not Authorized, please login first" });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = validateToken(token);
  req.user = decodedToken;
  return next();
}
module.exports = {
  authenticationMiddleware,
  ensureAuthMiddleware,
};
