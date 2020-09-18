const Movie = require("../models/movie.model");
const UpdatedMovie = require("../models/updatedMovie");
const ignoreProps = require("../validations/ignore.validation");
const { verifyRole } = require("../middleware/verify-role");
const { default: Axios } = require("axios");
const puppeteer = require("@scaleleap/puppeteer");
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
  const { start, end, url, serverWeb, serverVideo } = req.body;
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
      serverWeb,
      serverVideo
    );
    if (!dataCrawl) {
      return res.status(404).send({ error: "crawling web fail" });
    }
    console.log("Done");
    addMovieUpdated(malId);
    dataCrawl.forEach((data) => {
      const index = movie.episodes.findIndex(
        // eslint-disable-next-line eqeqeq
        (dataEp) => dataEp.episode == data.episode
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

router.put("/:malId", verifyRole("Admin", "User"), async (req, res) => {
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
  let dataApi;
  try {
    const api = await Axios.get(`https://api.jikan.moe/v3/anime/${malId}`);
    dataApi = api.data;
    const movie = await UpdatedMovie.findOne({ malId });
    if (movie) {
      return await movie.save();
    }
  } catch (error) {
    console.log("Can't add updated movie");
    return;
  }
  const newUpdatedMovie = new UpdatedMovie({
    malId,
    title: dataApi.title,
    imageUrl: dataApi.image_url,
    numEpisodes: dataApi.episodes,
    score: dataApi.score,
    synopsis: dataApi.synopsis,
  });

  try {
    await newUpdatedMovie.save();
  } catch (error) {
    console.log("Can't add updated movie");
  }
}

async function crawl(start, end, url, serverWeb, serverVideo) {
  const browser = await puppeteer.launch({
    extra: {
      stealth: true,
    },
    headless: true,
    args: ["--start-maximized", "--no-sandbox"],
    defaultViewport: null,
    timeout: 0,
  });
  try {
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    await page.setDefaultNavigationTimeout(0);
    const options = {
      waitUntil: "networkidle2",
      timeout: 0,
    };
    await page.goto(url, options);
    const linkWatching = await page.evaluate((serverWeb) => {
      let link = null;
      switch (serverWeb) {
        case "animehay":
          link = document.querySelector(
            ".ah-pif-ftool.ah-bg-bd.ah-clear-both > .ah-float-left > span"
          ).childNodes[0].href;
          break;
        case "animevsub":
          link = document.querySelectorAll(
            ".Content .TpRwCont .Image > a.watch_button_more"
          )[0].href;
          break;
        default:
          break;
      }
      return link;
    }, serverWeb);
    console.log(linkWatching);
    await page.goto(linkWatching, options);
    let listLinkWatchEpisode;
    switch (serverWeb) {
      case "animehay":
        listLinkWatchEpisode = await page.evaluate((start) => {
          let listLink = document.querySelector(".ah-wf-body ul");
          listLink = [...listLink.children];
          if(listLink.length === 1){
            return listLink.map((link) => ({
              url: link.children[0].href,
              textContent: "1",
            }))
          }
          for (let i = 0; i < listLink.length; i++) {
            if (listLink[i] && !listLink[i].textContent.includes(`${start}`)) {
              listLink[i].remove();
            } else {
              break;
            }
          }
          listLink = document.querySelector(".ah-wf-body ul");
          listLink = [...listLink.children];
          return listLink.map((link) => ({
            url: link.childNodes[0].href,
            textContent: link.textContent,
          }));
        }, start);
        break;
      case "animevsub":
        listLinkWatchEpisode = await page.evaluate((start) => {
          let listLink =
            document.querySelector(".Content #list-server ul .list-episode") ||
            document.querySelector(".Content #list-server ul");
          listLink = [...listLink.children];
          if(listLink.length === 1){
            return listLink.map((link) => ({
              url: link.children[0].href,
              textContent: "1",
            }))
          }
          for (let i = 0; i < listLink.length; i++) {
            if (listLink[i] && !listLink[i].textContent.includes(`${start}`)) {
              listLink[i].remove();
            } else {
              break;
            }
          }
          listLink =
            document.querySelector(".Content #list-server ul .list-episode") ||
            document.querySelector(".Content #list-server ul");
          listLink = [...listLink.children];
          return listLink.map((link) => ({
            url: link.childNodes[0].href,
            textContent: link.textContent,
          }));
        }, start);
        break;
      default:
        break;
    }
    let listSrc = [];
    const lastEpisode = parseInt(
      listLinkWatchEpisode[listLinkWatchEpisode.length - 1].textContent
    );
    const startEpisode = 0;
    const endEpisode =
      lastEpisode > end
        ? listLinkWatchEpisode.findIndex((link) =>
            link.textContent.includes(end.toString())
          ) + 1
        : listLinkWatchEpisode.length;
    for (let i = startEpisode; i < endEpisode; i++) {
      const data = await extractSourceVideo(
        page,
        listLinkWatchEpisode[i].url,
        serverWeb,
        serverVideo,
        options
      );
      listSrc.push({
        embedUrl: data ? data.url : "",
        episode: listLinkWatchEpisode[i].textContent,
        typeVideo: data ? data.typeVideo : false,
      });
    }
    browser.close();
    return listSrc;
  } catch (error) {
    console.log(error);
    if (browser) {
      browser.close();
    }
  }
}

async function extractSourceVideo(
  page,
  linkWatching,
  serverWeb,
  serverVideo,
  options
) {
  await page.goto(linkWatching, options);
  let episodeLink;
  if (serverVideo === "serverMoe")
    episodeLink = await page.evaluate((serverWeb) => {
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
  else if (serverVideo === "serverICQ")
    episodeLink = await page.evaluate((serverWeb) => {
      switch (serverWeb) {
        case "animehay":
          let listSv = document.querySelector("#list_sv").childNodes;
          listSv = [...listSv];
          let serverCrawl = listSv.find((sv) => sv.id === "serverICQ");
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
