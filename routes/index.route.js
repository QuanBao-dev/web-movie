const router = require("express").Router();
const path = require("path");
router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

router.get("/genre/:genreId",(req,res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
})

router.get("/anime/search", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

router.get("/anime/character/:characterId", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

router.get("/anime/person/:personId", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

router.get("/anime/:malId/watch/:episode/:mode", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
router.get("/anime/:name", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
router.get("/edit", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
router.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
router.get("/auth/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
router.get("/auth/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

router.get("/theater", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

router.get("/theater/:groupId", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

router.get("/faq", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

router.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

module.exports = router;
