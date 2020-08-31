const Movie = require("../models/movie.model");
const UpdatedMovie = require("../models/updatedMovie");
const ignoreProps = require("../validations/ignore.validation");
const { verifyRole } = require("../middleware/verify-role");
const { default: Axios } = require("axios");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

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
  const { start, end, url, serverWeb } = req.body;
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
    const dataCrawl = await crawl(
      parseInt(start),
      parseInt(end),
      url,
      serverWeb
    );
    if (!dataCrawl) {
      return res.status(404).send({ error: "crawling web fail" });
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

async function crawl(start, end, url, serverWeb) {
  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--ignore-certificate-errors",
      "--start-maximized",
    ],
    defaultViewport: null,
    ignoreHTTPSErrors: true,
  });
  try {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    const options = {
      waitUntil: "networkidle0",
      timeout: 0,
    };
  
    await page.goto(url, options);
    if (serverWeb === "animevsub") {
      await page.waitForSelector(".watch_button_more");
    }
    const linkWatching = await page.evaluate((serverWeb) => {
      let link = null;
      switch (serverWeb) {
        case "animehay":
          link = document.querySelector(
            ".ah-pif-ftool.ah-bg-bd.ah-clear-both > .ah-float-left > span"
          ).childNodes[0].href;
          break;
        case "animevsub":
          link = document.querySelector(".watch_button_more").href;
          break;
        default:
          break;
      }
      return link;
    }, serverWeb);
    console.log(linkWatching);
    await page.goto(linkWatching, options);
    const listLinkWatchEpisode = await page.evaluate((serverWeb) => {
      let listLink;
      switch (serverWeb) {
        case "animehay":
          listLink = [...document.querySelectorAll(".ah-wf-body ul li a")];
          break;
        case "animevsub":
          listLink = [...document.querySelectorAll(".list-server a")];
          break;
        default:
          break;
      }
      return listLink.map((link) => link.href);
    }, serverWeb);
    let listSrc = [];
    const startEpisode = start <= 0 ? 1 : start;
    const endEpisode =
      end > listLinkWatchEpisode.length ? listLinkWatchEpisode.length : end;
    for (let i = startEpisode - 1; i < endEpisode; i++) {
      const data = await extractSourceVideo(
        page,
        listLinkWatchEpisode[i],
        serverWeb,
        options
      );
      listSrc.push({
        embedUrl: data ? data.url : "",
        episode: i + 1,
        typeVideo: data ? data.typeVideo : "",
      });
    }
    await browser.close();  
    return listSrc;
  } catch (error) {
    if(browser){
      await browser.close();
    }
  }
}

async function extractSourceVideo(page, linkWatching, serverWeb, options) {
  await page.goto(linkWatching, options);
  const episodeLink = await page.evaluate((serverWeb) => {
    switch (serverWeb) {
      case "animehay":
        let listSv = document.querySelector("#list_sv").childNodes;
        listSv = [...listSv];
        let serverCrawl = listSv.find((sv) => sv.id === "serverMoe");
        if (!serverCrawl) {
          return null;
        }
        serverCrawl.click();
        return {
          url: document.querySelector(".film-player.ah-bg-bd iframe").src,
          typeVideo: false,
        };
      case "animevsub":
        let typeVideo = true;
        let e = document.querySelector(".media-player video");
        if (!e) {
          typeVideo = false;
          e = document.querySelector(".media-player iframe");
        }
        if (!e) {
          return null;
        }
        const linkEpisodeAnime = e.src;
        return { url: linkEpisodeAnime, typeVideo: typeVideo };
      default:
        return;
    }
  }, serverWeb);
  return episodeLink;
}

module.exports = router;
