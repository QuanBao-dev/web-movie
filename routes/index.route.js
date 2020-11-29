const router = require("express").Router();
const { default: Axios } = require("axios");
const fs = require("fs");
const path = require("path");
router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

router.get("/producer/:producerId", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

router.get("/studio/:producerId", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

router.get("/licensor/:producerId", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

router.get("/anime/search", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

router.get("/anime/character/:characterId", async (req, res) => {
  const descriptionHTML =
    "Watch latest anime in high quality and discuss about them with other people. Update daily, No tracking, No paying, No registration required. Just enjoy your anime";
  const titleHTML = "My Anime Fun - Watch latest anime in high quality";
  const imageHTML = "https://cdn.wallpapersafari.com/52/42/LOPbdm.jpg";
  const titleReg = new RegExp(titleHTML, "g");
  const descriptionReg = new RegExp(descriptionHTML, "g");
  const imageReg = new RegExp(imageHTML, "g");
  const { data } = await Axios(
    "https://api.jikan.moe/v3/character/" + req.params.characterId
  );
  const { name, image_url } = data;
  const filePath = path.join(__dirname, "../build", "index.html");
  fs.readFile(filePath, "utf8", (error, data) => {
    if (!error) {
      data = data
        .replace(titleReg, name)
        .replace(imageReg, image_url)
        .replace(descriptionReg, "Who is " + name + " ?");
      res.send(data);
    } else {
      res.sendFile(path.join(__dirname, "../build", "index.html"));
    }
  });
});

router.get("/anime/person/:personId", async (req, res) => {
  const descriptionHTML =
    "Watch latest anime in high quality and discuss about them with other people. Update daily, No tracking, No paying, No registration required. Just enjoy your anime";
  const titleHTML = "My Anime Fun - Watch latest anime in high quality";
  const imageHTML = "https://cdn.wallpapersafari.com/52/42/LOPbdm.jpg";
  const titleReg = new RegExp(titleHTML, "g");
  const descriptionReg = new RegExp(descriptionHTML, "g");
  const imageReg = new RegExp(imageHTML, "g");
  const { data } = await Axios(
    "https://api.jikan.moe/v3/person/" + req.params.personId
  );
  const { name, image_url } = data;
  const filePath = path.join(__dirname, "../build", "index.html");
  fs.readFile(filePath, "utf8", (error, data) => {
    if (!error) {
      data = data
        .replace(titleReg, name)
        .replace(imageReg, image_url)
        .replace(descriptionReg, "Who is " + name + " ?");
      res.send(data);
    } else {
      res.sendFile(path.join(__dirname, "../build", "index.html"));
    }
  });
});

router.get("/anime/:malId/watch/:episode/:mode", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
router.get("/anime/:id", async (req, res) => {
  const descriptionHTML =
    "Watch latest anime in high quality and discuss about them with other people. Update daily, No tracking, No paying, No registration required. Just enjoy your anime";
  const titleHTML = "My Anime Fun - Watch latest anime in high quality";
  const imageHTML = "https://cdn.wallpapersafari.com/52/42/LOPbdm.jpg";
  const titleReg = new RegExp(titleHTML, "g");
  const descriptionReg = new RegExp(descriptionHTML, "g");
  const imageReg = new RegExp(imageHTML, "g");
  const { data } = await Axios(
    "https://api.jikan.moe/v3/anime/" + req.params.id
  );
  const { title, synopsis, image_url } = data;
  const filePath = path.join(__dirname, "../build", "index.html");
  fs.readFile(filePath, "utf8", (error, data) => {
    if (!error) {
      data = data
        .replace(titleReg, title)
        .replace(imageReg, image_url)
        .replace(descriptionReg, synopsis);
      res.send(data);
    } else {
      res.sendFile(path.join(__dirname, "../build", "index.html"));
    }
  });
});

router.get("/genre/:genreId", (req, res) => {
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
