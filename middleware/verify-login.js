const jwt = require("jsonwebtoken");

module.exports.verifyLogin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  let token;
  token = authHeader && authHeader.split(" ")[1];
  if (!token) token = req.signedCookies.idCartoonUser;
  console.log(token);
  if (!token) return next();
  try {
    const verified = jwt.verify(token, process.env.JWT_KEY);
    req.user = verified;
    res.status(401).send({ error: "You already logged in" });
  } catch {
    res.status(400).send({ error: "Invalid token" });
  }
};
