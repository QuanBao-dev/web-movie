const router = require("express").Router();
const { default: Axios } = require("axios");
const fs = require("fs");
const path = require("path");
router.get("/character/:characterId", async (req, res) => {
  const descriptionHTML =
    "Watch latest anime in high quality and discuss about them with other people. Update daily, No tracking, No paying, No registration required. Just enjoy your anime";
  const titleHTML = "My Anime Fun - Watch latest anime in high quality";
  const imageHTML = "https://cdn.wallpapersafari.com/52/42/LOPbdm.jpg";
  const titleReg = new RegExp(titleHTML, "g");
  const descriptionReg = new RegExp(descriptionHTML, "g");
  const imageReg = new RegExp(imageHTML, "g");
  try {
    const { data } = await Axios(
      "https://api.jikan.moe/v4/characters/" + parseInt(req.params.characterId)
    );
    const { name } = data.data;
    const image_url = data.data.images.jpg.image_url;
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
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.get("/person/:personId", async (req, res) => {
  const descriptionHTML =
    "Watch latest anime in high quality and discuss about them with other people. Update daily, No tracking, No paying, No registration required. Just enjoy your anime";
  const titleHTML = "My Anime Fun - Watch latest anime in high quality";
  const imageHTML = "https://cdn.wallpapersafari.com/52/42/LOPbdm.jpg";
  const titleReg = new RegExp(titleHTML, "g");
  const descriptionReg = new RegExp(descriptionHTML, "g");
  const imageReg = new RegExp(imageHTML, "g");
  try {
    const { data } = await Axios(
      "https://api.jikan.moe/v4/people/" + parseInt(req.params.personId)
    );
    const { name } = data.data;
    const image_url = data.data.images.jpg.image_url;
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
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.get("/anime/:id", async (req, res) => {
  const descriptionHTML =
    "Watch latest anime in high quality and discuss about them with other people. Update daily, No tracking, No paying, No registration required. Just enjoy your anime";
  const titleHTML = "My Anime Fun - Watch latest anime in high quality";
  const imageHTML = "https://cdn.wallpapersafari.com/52/42/LOPbdm.jpg";
  const titleReg = new RegExp(titleHTML, "g");
  const descriptionReg = new RegExp(descriptionHTML, "g");
  const imageReg = new RegExp(imageHTML, "g");
  try {
    const { data } = await Axios(
      "https://api.jikan.moe/v4/anime/" + parseInt(req.params.id)
    );
    const { title, synopsis } = data.data;
    const image_url =
      data.data.images.jpg.large_image_url || data.data.images.jpg.image_url;
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
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

module.exports = router;
