const router = require("express").Router();
const User = require("../models/user.model");
const BoxMovie = require("../models/boxMovie.model");
const ignoreProps = require("../validations/ignore.validation");
const { verifyRole } = require("../middleware/verify-role");
router.get("/", verifyRole("Admin", "User"), async (req, res) => {
  //TODO Get all box movie of user login
  const page = req.query.page || "0";
  const user = await User.findOne({ userId: req.user.userId });
  const userId = user._id;
  try {
    const boxMovie = await BoxMovie.find({ user: userId });
    const lastPage = Math.ceil(boxMovie.length / 18);
    res.send({
      message: {
        data: boxMovie
          .slice((parseInt(page) - 1) * 18, parseInt(page) * 18)
          .map((movie) => ignoreProps(["_id", "__v", "user"], movie.toJSON())),
        lastPage,
      },
    });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.get("/:malId", verifyRole("Admin", "User"), async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    const userId = user._id;
    const boxMovie = await BoxMovie.findOne({
      $and: [{ user: userId }, { malId: req.params.malId }],
    });
    if (!boxMovie) {
      return res.status(401).send({ error: "You don't have this movie" });
    }
    res.status(200).send({
      message: ignoreProps(["_id", "__v", "user"], boxMovie.toJSON()),
    });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.post("/", verifyRole("Admin", "User"), async (req, res) => {
  //TODO Adding one movie from one user in BoxMovie list
  const user = await User.findOne({ userId: req.user.userId });
  const userId = user._id;
  try {
    const movie = await BoxMovie.findOneAndUpdate(
      {
        $and: [{ user: userId }, { malId: req.body.malId }],
      },
      {
        user: userId,
        malId: req.body.malId,
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        episodes: req.body.episodes,
        score: req.body.score,
        airing: req.body.airing,
        synopsis: req.body.synopsis,
      },
      {
        upsert: true,
        new: true,
      }
    );
    res.send({
      message: ignoreProps(["_id", "__v", "user"], movie.toJSON()),
    });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.delete("/:malId", verifyRole("Admin", "User"), async (req, res) => {
  const user = await User.findOne({ userId: req.user.userId });
  const userId = user._id;
  const movie = await BoxMovie.findOne({
    $and: [{ user: userId }, { malId: req.params.malId }],
  });
  try {
    const removedMovie = await movie.remove();
    res.send({
      message: ignoreProps(["_id", "__v", "user"], removedMovie.toJSON()),
    });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

module.exports = router;
