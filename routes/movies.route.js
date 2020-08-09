const Movie = require("../models/movie.model");
const UpdatedMovie = require("../models/updatedMovie");
const ignoreProps = require("../validations/ignore.validation");
const { verifyRole } = require("../middleware/verify-role");
const { default: Axios } = require("axios");

const router = require("express").Router();

router.get("/", verifyRole("Admin"), async (req, res) => {
  ///TODO get all movie
  try {
    const movies = await Movie.find({});
    res.send({
      message: movies.map((movie) =>
        ignoreProps(["_id", "__v"], movie.toJSON())
      ),
    });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.get("/latest", async (req, res) => {
  try {
    const updatedMovies = await UpdatedMovie.find();
    res.json({
      message: updatedMovies.map((movie) => {
        return ignoreProps(["_id", "__v"], movie.toJSON());
      }),
    });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.get("/:malId/episodes", async (req, res) => {
  try {
    const movie = await Movie.findOne({ malId: req.params.malId });
    const episodes = movie.episodes;
    res.send({
      message: episodes.map((message) => {
        return ignoreProps(["_id", "__v"], message.toJSON());
      }),
    });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.get("/:malId", async (req, res) => {
  try {
    const movie = await Movie.findOne({ malId: req.params.malId });
    const newMovie = new Movie({
      malId: req.params.malId,
    });
    if (!movie) {
      const messages = newMovie.messages;
      return res.send({
        message: messages.map((message) => {
          return ignoreProps(["_id", "__v"], message.toJSON());
        }),
      });
    }
    const messages = movie.messages;
    res.send({
      message: messages.map((message) => {
        return ignoreProps(["_id", "__v"], message.toJSON());
      }),
    });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.put("/admin/:malId", verifyRole("Admin"), async (req, res) => {
  try {
    const movie = await Movie.findOne({ malId: req.params.malId });
    movie.messages = req.body;
    const movieAfterDeleteMessage = await movie.save();
    res.send({
      message: movieAfterDeleteMessage.messages.map((message) => {
        return ignoreProps(["_id", "__v"], message.toJSON());
      }),
    });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.put(
  "/:malId/episode/:episode",
  verifyRole("Admin"),
  async (req, res) => {
    const { malId, episode } = req.params;
    addMovieUpdated(malId);
    const dataUpdated = req.body;
    dataUpdated.episode = episode;
    try {
      const movie = await Movie.findOneAndUpdate(
        { malId },
        {},
        {
          new: true,
          upsert: true,
        }
      );
      let check = false;
      movie.episodes = movie.episodes.map((data) => {
        if (data.episode === parseInt(episode)) {
          check = true;
          return dataUpdated;
        }
        return data;
      });
      if (!check) {
        movie.episodes.push(dataUpdated);
        movie.episodes.sort((a, b) => a.episode - b.episode);
      }
      const savedMovie = await movie.save();
      res.send(
        savedMovie.episodes.map((episode) => {
          return ignoreProps(["_id", "__v"], episode.toJSON());
        })
      );
    } catch (error) {
      res.status(404).send("Something went wrong");
    }
  }
);

router.put("/:malId", async (req, res) => {
  const { malId } = req.params;
  const dataModified = req.body;
  try {
    const movie = await Movie.findOneAndUpdate({ malId }, dataModified, {
      new: true,
      upsert: true,
    });
    res.send({ message: ignoreProps(["_id", "__v"], movie.toJSON()) });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.delete("/:malId", verifyRole("Admin"), async (req, res) => {
  const { malId } = req.params;
  try {
    const movie = await Movie.findOneAndRemove({ malId });
    res.send({ message: ignoreProps(["_id", "__v"], movie.toJSON()) });
  } catch {
    res.status(404).send({ error: "Something went wrong" });
  }
});

async function addMovieUpdated(malId) {
  const api = await Axios.get(`https://api.jikan.moe/v3/anime/${malId}`);
  const dataApi = api.data;
  try {
    const movie = await UpdatedMovie.findOne({ malId });
    if (movie) {
      return await movie.save();
    }
  } catch (error) {}
  const newUpdatedMovie = new UpdatedMovie({
    malId,
    title: dataApi.title,
    imageUrl: dataApi.image_url,
    numEpisodes: dataApi.episodes,
    score: dataApi.score,
  });

  try {
    await newUpdatedMovie.save();
  } catch (error) {}
}

module.exports = router;
