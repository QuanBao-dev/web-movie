const router = require("express").Router();
const User = require("../models/user.model");
const BoxMovie = require("../models/boxMovie.model");
const LengthMovie = require("../models/lengthMovie.model");
const ignoreProps = require("../validations/ignore.validation");
const { verifyRole } = require("../middleware/verify-role");
router.get("/", verifyRole("Admin", "User"), async (req, res) => {
  //TODO Get all box movie of user login
  const page = req.query.page || "0";
  const user = await User.findOne({ userId: req.user.userId });
  const userId = user._id;
  try {
    const [boxMovie, { length }] = await Promise.all([
      BoxMovie.aggregate([
        { $sort: { dateAdded: -1 } },
        { $match: { user: userId } },
        { $skip: (parseInt(page) - 1) * 18 },
        { $limit: 18 },
        {
          $project: {
            _id: 0,
            malId: 1,
            title: 1,
            imageUrl: 1,
            episodes: 1,
            score: 1,
            synopsis: 1,
            airing: 1,
            dateAdded: 1,
          },
        },
      ]),
      LengthMovie.findOne({ userId: req.user.userId })
        .select({ _id: 0, length: 1 })
        .lean(),
    ]);
    const lastPage = Math.ceil(length / 18);
    res.send({
      message: {
        data: boxMovie,
        lastPage,
        pagination: {
          has_next_page: lastPage > parseInt(page),
        },
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
      return res.status(405).send({ error: "You don't own this movie" });
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
    ).lean();
    const length = await BoxMovie.countDocuments({user: userId});
    await LengthMovie.findOneAndUpdate(
      { userId: req.user.userId },
      {
        name: req.user.userId,
        length,
      },
      {
        new: true,
        upsert: true,
      }
    );
    res.send({
      message: ignoreProps(["_id", "__v", "user"], movie),
    });
  } catch (error) {
    console.log(error);
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
    const length = await BoxMovie.countDocuments({user:userId});
    await LengthMovie.findOneAndUpdate(
      { userId: req.user.userId },
      {
        name: req.user.userId,
        length,
      },
      {
        new: true,
        upsert: true,
      }
    );
    res.send({
      message: ignoreProps(["_id", "__v", "user"], removedMovie.toJSON()),
    });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

module.exports = router;
