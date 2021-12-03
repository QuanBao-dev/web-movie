/* eslint-disable no-useless-escape */
const Movie = require("../models/movie.model");
const UpdatedMovie = require("../models/updatedMovie");
const ignoreProps = require("../validations/ignore.validation");
const { verifyRole } = require("../middleware/verify-role");
const { default: Axios } = require("axios");
const puppeteer = require("@scaleleap/puppeteer");
const CarouselMovie = require("../models/carouselMovie.model");
const User = require("../models/user.model");
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
  const page = req.query.page || "1";
  try {
    let movies, lastPage;
    const updatedMovies = await UpdatedMovie.find();
    lastPage = Math.ceil(updatedMovies.length / 18);
    if (page) {
      movies = updatedMovies.sort(
        (moviePrev, movieCurrent) =>
          -new Date(moviePrev.updatedAt).getTime() +
          new Date(movieCurrent.updatedAt).getTime()
      );
      movies = updatedMovies.slice(
        (parseInt(page) - 1) * 18,
        parseInt(page) * 18
      );
    }
    res.json({
      message: {
        data: movies.map((movie) => {
          return ignoreProps(["_id", "__v"], movie.toJSON());
        }),
        lastPage,
      },
    });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.get("/carousel", async (req, res) => {
  try {
    const dataSend = await CarouselMovie.findOne({ name: "data" })
      .lean()
      .select({ _id: 0, data: 1 });
    res.send({ message: dataSend.data });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.put("/carousel/:id", verifyRole("Admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  const { malId, url } = req.body;
  try {
    const [carouselList, dataAnime] = await Promise.all([
      CarouselMovie.findOne({ name: "data" }),
      Axios.get("https://api.jikan.moe/v3/anime/" + malId),
    ]);
    const { title } = dataAnime.data;
    const dataList = carouselList.data.map((data, index) => {
      if (index === id) {
        return {
          title,
          malId,
          url,
        };
      }
      return data;
    });
    const data = await CarouselMovie.findOneAndUpdate(
      { name: "data" },
      {
        data: dataList,
      },
      {
        new: true,
        upsert: true,
      }
    ).lean();
    res.send({
      message: data.data,
    });
  } catch (error) {
    if (error) return res.status(400).send({ error });
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.get("/:malId/episodes", async (req, res) => {
  try {
    const movie = await Movie.findOne({ malId: req.params.malId });
    const episodes = movie.episodes || [];
    const episodesEng = movie.episodesEng || [];
    const episodesEngDub = movie.episodesEngDub || [];
    res.send({
      message: {
        source: movie.sourceFilm || "",
        sourceFilmList: ignoreProps(
          ["_id", "__v"],
          movie.sourceFilmList.toJSON()
        ),
        episodes: episodes.map((message) => {
          return ignoreProps(["_id", "__v"], message.toJSON());
        }),
        episodesEng: episodesEng.map((message) => {
          return ignoreProps(["_id", "__v"], message.toJSON());
        }),
        episodesEngDub: episodesEngDub.map((message) => {
          return ignoreProps(["_id", "__v"], message.toJSON());
        }),
      },
    });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.get("/:malId", async (req, res) => {
  const page = parseInt(req.query.page || "1");
  const numberCommentOfEachPage = 5;
  try {
    const movie = await Movie.findOne({ malId: req.params.malId }).lean();
    const newMovie = new Movie({
      malId: req.params.malId,
    });
    if (!movie) {
      const messages = newMovie.messages;
      return res.send({
        message: messages.map((message) => {
          return ignoreProps(["_id", "__v"], message);
        }),
      });
    }
    const messages = movie.messages;

    let allPos50pxMargin = [];
    for (let i = 1; i < messages.length; i++) {
      if (
        messages[i - 1].marginLeft === "50px" &&
        convertPxToInt(messages[i].marginLeft) >=
          convertPxToInt(messages[i - 1].marginLeft)
      ) {
        allPos50pxMargin.push({ pos: i });
      }
    }
    if (
      messages[messages.length - 1] &&
      messages[messages.length - 1].marginLeft === "50px"
    ) {
      allPos50pxMargin.push({ pos: messages.length });
    }
    res.send({
      message: {
        data: await Promise.all(
          messages
            .slice(
              allPos50pxMargin[(page - 1) * numberCommentOfEachPage]
                ? allPos50pxMargin[(page - 1) * numberCommentOfEachPage].pos - 1
                : 0,
              allPos50pxMargin[page * numberCommentOfEachPage]
                ? allPos50pxMargin[page * numberCommentOfEachPage].pos - 1
                : messages.length
            )
            .map(async (message) => {
              const user = await User.findOne({
                userId: message.userId,
              })
                .lean()
                .select({ _id: 0, avatarImage: 1 });
              return {
                avatar: user.avatarImage,
                ...ignoreProps(["_id", "__v"], message),
              };
            })
        ),
        lastPage:
          Math.ceil(allPos50pxMargin.length / numberCommentOfEachPage) || 1,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.put(
  "/message/delete/:malId",
  verifyRole("Admin", "User"),
  async (req, res) => {
    const { commentId } = req.body;
    const movie = await Movie.findOne({ malId: req.params.malId });
    const index = movie.messages.findIndex(
      (message) => message.commentId === commentId
    );
    if (index === -1) {
      return res.status(404).send({
        error: {
          message: "comment has been deleted",
        },
      });
    }
    if (index) {
      if (movie.messages[index].userId !== req.user.userId) {
        return res.status(400).send({ error: "You don't own this comment" });
      }
    }
    if (!movie) {
      return res.status(400).send({ error: "movie not found" });
    }
    let listDelete = [index];
    if (movie.messages[index].userId !== req.user.userId) {
      return res.status(401).send({ error: "Can't delete comment" });
    }
    for (let i = index + 1; i < movie.messages.length; i++) {
      if (
        convertPxToInt(movie.messages[i].marginLeft) <=
        convertPxToInt(movie.messages[index].marginLeft)
      ) {
        break;
      }
      listDelete.push(i);
    }
    try {
      movie.messages = updateDeleteComment(movie, listDelete);
      await movie.save();
      res.send({});
    } catch (error) {
      res.status(404).send({ error: "Something went wrong" });
    }
  }
);

function convertPxToInt(string = "") {
  return parseInt(string.replace(/px/g, ""));
}

function updateDeleteComment(state, listDelete = []) {
  return state.messages.filter((message, index) => !listDelete.includes(index));
}

router.put("/:malId/episodes/crawl", verifyRole("Admin"), async (req, res) => {
  const { start, end, url, serverWeb, isDub } = req.body;
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
    const savedMovie = await updateEpisodeCrawl(
      start,
      end,
      url,
      serverWeb,
      res,
      malId,
      isDub,
      movie
    );
    const newLocal = "Something went wrong";
    if (!savedMovie) throw newLocal;
    res.send({
      message: {
        source: movie.sourceFilm,
        sourceFilmList: ignoreProps(
          ["_id", "__v"],
          movie.sourceFilmList.toJSON()
        ),
        episodes: savedMovie.episodes.map((episode) =>
          ignoreProps(["_id", "__v"], episode.toJSON())
        ),
        episodesEng: savedMovie.episodesEng.map((episode) =>
          ignoreProps(["_id", "__v"], episode.toJSON())
        ),
        episodesEngDub: savedMovie.episodesEngDub.map((episode) =>
          ignoreProps(["_id", "__v"], episode.toJSON())
        ),
      },
    });
  } catch (error) {
    // console.error(error);
    res.status(404).send({ error: "Something went wrong" });
  }
});

router.put(
  "/:malId/episode/:episode/:language/:isDub",
  verifyRole("Admin"),
  async (req, res) => {
    const { malId, episode, language, isDub } = req.params;
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
      if (language === "vi") {
        movie.episodes = movie.episodes.map((data) => {
          // eslint-disable-next-line eqeqeq
          if (data.episode == episode) {
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
      }
      if (language === "eng") {
        if (isDub === "true") {
          movie.episodesEngDub = movie.episodesEngDub.map((data) => {
            // eslint-disable-next-line eqeqeq
            if (data.episode == episode) {
              check = true;
              return dataUpdated;
            }
            return data;
          });
          if (!check) {
            movie.episodesEngDub.push(dataUpdated);
            movie.episodesEngDub.sort((a, b) => a.episode - b.episode);
          }
          const savedMovie = await movie.save();
          res.send(
            savedMovie.episodesEngDub.map((episode) => {
              return ignoreProps(["_id", "__v"], episode.toJSON());
            })
          );
        } else {
          movie.episodesEng = movie.episodesEng.map((data) => {
            // eslint-disable-next-line eqeqeq
            if (data.episode == episode) {
              check = true;
              return dataUpdated;
            }
            return data;
          });
          if (!check) {
            movie.episodesEng.push(dataUpdated);
            movie.episodesEng.sort((a, b) => a.episode - b.episode);
          }
          const savedMovie = await movie.save();
          res.send(
            savedMovie.episodesEng.map((episode) => {
              return ignoreProps(["_id", "__v"], episode.toJSON());
            })
          );
        }
      }
    } catch (error) {
      res.status(404).send("Something went wrong");
    }
  }
);

router.put("/:malId", verifyRole("Admin", "User"), async (req, res) => {
  const { malId } = req.params;
  const { newMessage, commentId, isPush } = req.body;
  if (
    newMessage.textContent.trim().length === 0 ||
    newMessage.author.trim() === ""
  ) {
    return res.status(400).send({
      error: {
        message: "Bad request",
      },
    });
  }
  const movie = await Movie.findOne({ malId });
  let index = null;
  if (commentId) {
    index = movie.messages.findIndex(
      (message) => message.commentId === commentId
    );
    if (index === -1) {
      return res.status(404).send({
        error: {
          message: "The comment you answer has just been deleted",
        },
      });
    }
  }
  try {
    movie.messages = updateComment(movie, newMessage, index, isPush);
    await movie.save();
    res.send({});
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});

async function updateEpisodeCrawl(
  start,
  end,
  url,
  serverWeb,
  res,
  malId,
  isDub,
  movie
) {
  const dataCrawl = await crawl(parseInt(start), parseInt(end), url, serverWeb);
  if (res) {
    if (dataCrawl.error) {
      res.status(400).send({ error: dataCrawl.error });
      return;
    }
    if (!dataCrawl) {
      res.status(404).send({ error: "crawling web fail" });
      return;
    }
  } else {
    if (dataCrawl.error || !dataCrawl) {
      return;
    }
  }
  console.log("Done");
  addMovieUpdated(malId);
  if (isDub) {
    dataCrawl.forEach((data) => {
      const index = movie.episodesEngDub.findIndex(
        // eslint-disable-next-line eqeqeq
        (dataEp) => dataEp.episode == data.episode
      );
      if (index < 0) {
        movie.episodesEngDub.push(data);
      } else {
        movie.episodesEngDub[index] = data;
      }
    });
    movie.episodesEngDub.sort((a, b) => a.episode - b.episode);
  } else {
    dataCrawl.forEach((data) => {
      const index = movie.episodesEng.findIndex(
        // eslint-disable-next-line eqeqeq
        (dataEp) => dataEp.episode == data.episode
      );
      if (index < 0) {
        movie.episodesEng.push(data);
      } else {
        movie.episodesEng[index] = data;
      }
    });
    movie.episodesEng.sort((a, b) => a.episode - b.episode);
  }
  updateSourceFilmList(movie, serverWeb, isDub, url);
  return await movie.save();
}

function updateSourceFilmList(movie, serverWeb, isDub, url) {
  if (!movie.sourceFilmList)
    movie.sourceFilmList = {
      episodes: "",
      episodesEng: "",
      episodesEngDub: "",
    };
  const keySourceFilm =
    serverWeb === "animehay" || serverWeb === "animevsub"
      ? "episodes"
      : serverWeb === "gogostream" && isDub
      ? "episodesEngDub"
      : serverWeb === "gogostream" && !isDub
      ? "episodesEng"
      : "";
  movie.sourceFilmList[keySourceFilm] = url;
}

function updateComment(movie, newMessage, index, isPush = true) {
  let suitablePositionToAdd = movie.messages.length;
  if (index !== null) {
    const marginLeftSource = parseInt(
      movie.messages[index].marginLeft.replace(/px/g, "")
    );
    for (let i = index + 1; i < movie.messages.length; i++) {
      if (
        marginLeftSource >=
        parseInt(movie.messages[i].marginLeft.replace(/px/g, ""))
      ) {
        suitablePositionToAdd = i;
        // console.log({suitablePositionToAdd});
        break;
      }
    }
  }
  // console.log(suitablePositionToAdd);
  if (isPush) {
    movie = {
      ...movie,
      messages: [
        ...movie.messages.slice(0, suitablePositionToAdd),
        newMessage,
        ...movie.messages.slice(suitablePositionToAdd, movie.messages.length),
      ],
    };
  } else {
    movie = {
      ...movie,
      messages: [
        ...movie.messages.slice(suitablePositionToAdd, movie.messages.length),
        newMessage,
        ...movie.messages.slice(0, suitablePositionToAdd),
      ],
    };
  }
  return movie.messages;
}

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
    const movie = await UpdatedMovie.findOneAndUpdate(
      { malId },
      {
        title: dataApi.title,
        imageUrl: dataApi.image_url,
        numEpisodes: dataApi.episodes,
        score: dataApi.score,
        synopsis: dataApi.synopsis,
      },
      {
        new: true,
        upsert: true,
      }
    ).lean();
    return movie;
  } catch (error) {
    throw Error("Can't add updated movie");
  }
}

async function crawl(start, end, url, serverWeb) {
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
    let linkWatching;
    if (serverWeb === "gogostream") {
      linkWatching = url;
    }
    console.log(linkWatching);
    await page.goto(linkWatching, options);
    let listLinkWatchEpisode;
    switch (serverWeb) {
      case "gogostream":
        listLinkWatchEpisode = await page.evaluate((start) => {
          let listLink = document.querySelector(
            ".video-info-left ul.listing.items.lists"
          );
          listLink = [...listLink.children];
          listLink[listLink.length - 1].tagName === "DIV" &&
            listLink[listLink.length - 1].remove();
          listLink[listLink.length - 1].tagName === "DIV" &&
            (listLink = listLink.slice(0, listLink.length - 1));
          listLink = listLink.reverse();
          for (let i = 0; i < listLink.length; i++) {
            if (
              listLink[i] &&
              !listLink[i].children[0].children[1].textContent
                .trim()
                .replace(/[0-9][a-z]+/g, "")
                .match(new RegExp("Episode " + start + "([.0-9]+)?$", "g"))
            ) {
              listLink[i].remove();
            } else {
              break;
            }
          }
          listLink = document.querySelector(
            ".video-info-left ul.listing.items.lists"
          );
          listLink = [...listLink.children];
          listLink = listLink.reverse();
          return listLink.map((link) => ({
            url: link.children[0].href,
            textContent: link.children[0].children[1].textContent
              .replace(/[0-9][a-z]+/g, "")
              .trim()
              .match(/Episode [0-9.]+$/g)[0]
              .replace("Episode ", ""),
          }));
        }, start);
        break;
      default:
        break;
    }
    let listSrc = [];
    if (!listLinkWatchEpisode[listLinkWatchEpisode.length - 1]) {
      browser.close();
      return { error: "invalid start episode" };
    }
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
    if (browser) {
      browser.close();
    }
  }
}

async function extractSourceVideo(page, linkWatching, serverWeb, options) {
  await page.goto(linkWatching, options);
  let episodeLink;
  episodeLink = await page.evaluate((serverWeb) => {
    switch (serverWeb) {
      case "gogostream":
        let iframeE = document.querySelector(".watch_play .play-video iframe");
        return { url: iframeE.src };
      default:
        return;
    }
  }, serverWeb);
  return episodeLink;
}

module.exports = router;
