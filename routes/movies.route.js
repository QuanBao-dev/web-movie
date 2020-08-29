const Movie = require("../models/movie.model");
const UpdatedMovie = require("../models/updatedMovie");
const ignoreProps = require("../validations/ignore.validation");
const { verifyRole } = require("../middleware/verify-role");
const { default: Axios } = require("axios");
const puppeteer = require("puppeteer");

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
      message: {
        source: movie.sourceFilm || "",
        episodes: episodes.map((message) => {
          return ignoreProps(["_id", "__v"], message.toJSON());
        }),
      },
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

router.put("/:malId/episodes/crawl", verifyRole("Admin"), async (req, res) => {
  const { start, end, url, server, webName } = req.body;
  const { malId } = req.params;
  let movie = await Movie.findOne({ malId });
  if (movie) {
    movie.sourceFilm = url;
  } else {
    movie = new Movie({
      sourceFilm: url,
      malId: malId,
    });
  }
  try {
    let dataCrawl;
    switch (webName) {
      case "animehay":
        dataCrawl = await crawl(parseInt(start), parseInt(end), url, server);
        break;
      case "animevsub":
        dataCrawl = await crawlAnimevsub(parseInt(start), parseInt(end), url);
        break;
      default:
        break;
    }
    addMovieUpdated(malId);
    dataCrawl.forEach((data) => {
      const index = movie.episodes.findIndex(
        (dataEp) => dataEp.episode === data.episode
      );
      if (index < 0) {
        movie.episodes.push(data);
      } else {
        movie.episodes[index] = data;
      }
    });
    movie.episodes.sort((a, b) => a.episode - b.episode);
    const savedMovie = await movie.save();
    res.send({
      message: {
        source: movie.sourceFilm,
        episodes: savedMovie.episodes.map((episode) =>
          ignoreProps(["_id", "__v"], episode.toJSON())
        ),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.put(
  "/:malId/episode/:episode",
  verifyRole("Admin"),
  async (req, res) => {
    const { malId, episode } = req.params;
    const dataUpdated = req.body;
    dataUpdated.episode = episode;
    try {
      const [movie] = await Promise.all([
        Movie.findOneAndUpdate(
          { malId },
          {},
          {
            new: true,
            upsert: true,
          }
        ),
        addMovieUpdated(malId),
      ]);
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
    const [movie, updatedMovie] = await Promise.all([
      Movie.findOne({ malId }),
      UpdatedMovie.findOne({ malId }),
    ]);
    movie && movie.remove();
    updatedMovie && updatedMovie.remove();
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

async function crawl(start, end, url, server) {
  const browser = await puppeteer.launch({
    headless: true,
    // executablePath:
    //   "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe", // because we are using puppeteer-core so we must define this option
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  const options = {
    waitUntil: "networkidle0",
    timeout: 0,
  };
  await page.goto(url, options);
  const linkWatching = await page.evaluate(() => {
    const link = document.querySelector(
      ".ah-pif-ftool.ah-bg-bd.ah-clear-both > .ah-float-left > span"
    ).childNodes[0].href;
    return link;
  });

  await page.goto(linkWatching, options);
  const listLinkWatchEpisode = await page.evaluate(() => {
    let listLink = document.querySelectorAll(".ah-wf-body ul li a");
    listLink = [...listLink];
    return listLink.map((link) => link.href);
  });
  let listSrc = [];
  const startEpisode = start <= 0 ? 1 : start;
  const endEpisode =
    end > listLinkWatchEpisode.length ? listLinkWatchEpisode.length : end;
  for (let i = startEpisode - 1; i < endEpisode; i++) {
    listSrc.push({
      embedUrl: await extractSourceVideo(
        page,
        listLinkWatchEpisode[i],
        server,
        options
      ),
      episode: i + 1,
    });
  }
  await browser.close();
  return listSrc;
}

async function extractSourceVideo(page, linkWatching, server, options) {
  await page.goto(linkWatching, options);
  const episodeLink = await page.evaluate((server) => {
    let listSv = document.querySelector("#list_sv").childNodes;
    listSv = [...listSv];
    listSv.find((sv) => sv.id === server).click();
    const linkEpisodeAnime = document.querySelector(
      ".film-player.ah-bg-bd iframe"
    ).src;
    return linkEpisodeAnime;
  }, server);
  return episodeLink;
}

async function crawlAnimevsub(start, end, url) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath:
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe", // because we are using puppeteer-core so we must define this option
    args: ["--remote-debugging-port=9222"],
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  const options = {
    waitUntil: "networkidle0",
    timeout: 0,
  };
  await page.goto(url, options);
  const linkWatching = await page.evaluate(() => {
    const link = document.querySelector(".watch_button_more").href;
    return link;
  });
  await page.goto(linkWatching, options);
  const listLinkWatchEpisode = await page.evaluate(() => {
    let links = [...document.querySelectorAll(".list-server a")];
    return links.map((v) => v.href);
  });
  let listSrc = [];
  const startEpisode = start <= 0 ? 1 : start;
  const endEpisode =
    end > listLinkWatchEpisode.length ? listLinkWatchEpisode.length : end;
  for (let i = startEpisode - 1; i < endEpisode; i++) {
    listSrc.push({
      embedUrl: await extractSourceVideoAnimevsub(
        page,
        listLinkWatchEpisode[i],
        options
      ),
      episode: i + 1,
    });
  }
  await browser.close();
  // return listLinkWatchEpisode;
  return listSrc;
}

async function extractSourceVideoAnimevsub(page, linkWatching, options) {
  await page.goto(linkWatching, options);
  const episodeLink = await page.evaluate(() => {
    let e = document.querySelector(".media-player video");
    if (!e) {
      e = document.querySelector(".media-player iframe");
    }
    const linkEpisodeAnime = e.src;
    return linkEpisodeAnime;
  });
  return episodeLink;
}

module.exports = router;
