const router = require("express").Router();
const { verifyRole } = require("../middleware/verify-role");
const RequestAnime = require("../models/requestAnime.model");
const User = require("../models/user.model");
const options = {
  createdAt: 1,
  updatedAt: 1,
  malId: 1,
  title: 1,
  imageUrl: 1,
  score: 1,
  synopsis: 1,
  usernames: 1,
  _id: 0,
};
router.get("/", verifyRole("Admin"), async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const numberOfElementsEachPage = 5;
  // Get requested anime each page
  try {
    const [requestedAnime, collectionLength] = await Promise.all([
      RequestAnime.aggregate([
        { $sort: { updatedAt: -1 } },
        { $skip: (page - 1) * numberOfElementsEachPage },
        { $limit: numberOfElementsEachPage },
        { $project: options },
      ]),
      RequestAnime.countDocuments({}),
    ]);
    res.send({
      message: {
        requestedAnime,
        maxPage: Math.ceil(collectionLength / numberOfElementsEachPage),
      },
    });
  } catch (error) {
    if (error) return res.status(401).send({ error });
    res.status(404).send("Something went wrong");
  }
});

router.post("/", verifyRole("Admin", "User"), async (req, res) => {
  const { malId, title, imageUrl, score, synopsis } = req.body;
  const userId = req.user.userId;
  let [{ username }, requestedAnime] = await Promise.all([
    User.findOne({ userId }).lean().select({ username: 1, _id: 0 }),
    RequestAnime.findOne({ malId }),
  ]);
  // Post requested anime each page
  try {
    if (!requestedAnime) {
      requestedAnime = new RequestAnime({
        malId,
        title,
        imageUrl,
        score,
        synopsis,
        usernames: [username],
      });
    } else {
      requestedAnime.malId = malId;
      requestedAnime.title = title;
      requestedAnime.imageUrl = imageUrl;
      requestedAnime.score = score;
      requestedAnime.synopsis = synopsis;
      if (!requestedAnime.usernames.includes(username))
        requestedAnime.usernames.push(username);
    }
    await requestedAnime.save();
    res.send({ message: "success" });
  } catch (error) {
    if (error) return res.status(401).send({ error });
    res.status(404).send("Something went wrong");
  }
});

router.delete("/:malId", verifyRole("Admin"), async (req, res) => {
  // Delete requested anime
  const { malId } = req.params;
  try {
    await RequestAnime.findOneAndRemove({ malId }, { new: true }).lean();
    res.send({
      message: "Success",
    });
  } catch (error) {
    if (error) return res.status(401).send({ error });
    res.status(404).send("Something went wrong");
  }
});

module.exports = router;
