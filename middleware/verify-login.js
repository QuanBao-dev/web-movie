const jwt = require("jsonwebtoken");

module.exports.verifyLogin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  let token;
  if (process.env.NODE_ENV === "development")
    token = authHeader && authHeader.split(" ")[1];
  if (process.env.NODE_ENV === "production")
    token = req.signedCookies.idCartoonUser;
  if (!token) return next();
  try {
    const verified = jwt.verify(token, process.env.JWT_KEY);
    req.user = verified;
    res.status(401).send({ error: "You already logged in" });
  } catch {
    res.status(400).send({ error: "Invalid token" });
  }
};
