import "./Name.css";

import Axios from "axios";
import { capitalize, orderBy } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { from, fromEvent, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  debounceTime,
  exhaustMap,
  filter,
  map,
  mergeMap,
  pluck,
  retry,
  switchMap,
} from "rxjs/operators";
import Input from "../components/Input/Input";
import { userStream } from "../epics/user";
import { allowShouldFetchComment } from "../store/comment";
import { allowUpdatedMovie } from "../store/home";
import { allowShouldFetchEpisodeMovie } from "../store/pageWatch";
import navBarStore from "../store/navbar";

const Name = (props) => {
  const { name } = props.match.params;
  const user = userStream.currentState();
  const [cookies] = useCookies();

  const [data, setData] = useState({});
  const [episodeData, setEpisodeData] = useState();
  const [boxMovie, setBoxMovie] = useState();

  const controlBoxMovieRef = useRef();
  const deleteMovieRef = useRef();
  const addMovieRef = useRef();
  const inputVideoUrlRef = useRef();
  const inputEpisodeRef = useRef();
  const startEpisodeInputRef = useRef();
  const endEpisodeInputRef = useRef();
  const linkWatchingInputRef = useRef();
  const buttonSubmitCrawlInputRef = useRef();
  const selectCrawlInputRef = useRef();
  const buttonDeleteCrawlInputRef = useRef();
  const typeVideoSelectRef = useRef();
  const selectCrawlServerVideo = useRef();
  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
    let subscription;
    let fetchSub;
    fetchSub = fetchData$(name)
      .pipe(
        mergeMap((anime) =>
          fetchDataVideo$(name).pipe(map((api) => ({ anime, api })))
        )
      )
      .subscribe(({ anime, api }) => {
        setData({
          ...anime,
          dataPromo: api,
        });
      });
    fetchEpisodeDataVideo(name)
      .then((api) => {
        if (linkWatchingInputRef.current)
          linkWatchingInputRef.current.value = api.message.source;
        setEpisodeData(api.message.episodes);
      })
      .catch(() => {
        console.log("Don't have episode");
      });
    fetchBoxMovieOneMovie(name, cookies.idCartoonUser)
      .then(async (api) => {
        controlBoxMovieRef.current.style.display = "inline";
        setBoxMovie(api.message);
        subscription = handleDeleteBoxMovie(
          addMovieRef,
          deleteMovieRef,
          cookies.idCartoonUser,
          setBoxMovie,
          name
        );
      })
      .catch(() => {
        if (controlBoxMovieRef.current)
          controlBoxMovieRef.current.style.display = "inline";
        subscription = handleAddBoxMovie(
          addMovieRef,
          deleteMovieRef,
          cookies.idCartoonUser,
          setBoxMovie,
          name
        );
      });
    return () => {
      subscription && subscription.unsubscribe();

      fetchSub && fetchSub.unsubscribe();
    };
  }, [cookies.idCartoonUser, name]);

  if (data) {
    findingAnime = data;
  }
  let arrKeys;
  if (findingAnime) {
    arrKeys = Object.keys(findingAnime).filter((v) => {
      return [
        "title",
        "image_url",
        "url",
        "synopsis",
        "trailer_url",
        "request_hash",
        "request_cached",
        "request_cache_expiry",
        "mal_id",
      ].indexOf(v) === -1
        ? true
        : false;
    });
  }
  // console.log(episodeData);
  return (
    findingAnime && (
      <div className="anime-name-info layout">
        <h1 className="title">{findingAnime.title}</h1>
        <div className="image">
          <img
            src={
              findingAnime.image_url ||
              "https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png"
            }
            alt="Not found"
          />
        </div>
        <div className="menu-control">
          {episodeData && episodeData.length > 0 && (
            <Link
              className="btn btn-success"
              onClick={() => {
                allowShouldFetchComment(true);
                allowShouldFetchEpisodeMovie(true);
              }}
              to={"/anime/" + name + `/watch/${episodeData[0].episode}`}
            >
              Watch
            </Link>
          )}
          {user && (
            <span style={{ display: "none" }} ref={controlBoxMovieRef}>
              {!boxMovie && (
                <span className="btn btn-primary" ref={addMovieRef}>
                  Add to Box
                </span>
              )}
              {boxMovie && (
                <span ref={deleteMovieRef} className="btn btn-danger">
                  Delete from Box
                </span>
              )}
            </span>
          )}
        </div>
        <div className="box">
          <div className="box-info">
            <h1
              style={{
                margin: "0",
              }}
              className="title"
            >
              About
            </h1>
            <ListInformation arrKeys={arrKeys} />
          </div>
          <div className="box-content">
            <h1 style={{ margin: "0" }} className="title">
              Summary
            </h1>
            <div className="content">{findingAnime.synopsis}</div>
            {user && user.role === "Admin" && (
              <div className="admin-section">
                <button
                  className="btn btn-danger"
                  ref={buttonDeleteCrawlInputRef}
                  onClick={async () => {
                    buttonDeleteCrawlInputRef.current.disabled = true;
                    navBarStore.updateIsShowBlockPopUp(true);
                    try {
                      await Axios.delete(`/api/movies/${name}`, {
                        headers: {
                          authorization: `Bearer ${cookies.idCartoonUser}`,
                        },
                      });
                      allowUpdatedMovie(true);
                      navBarStore.updateIsShowBlockPopUp(false);
                      setEpisodeData([]);
                      buttonDeleteCrawlInputRef.current.disabled = false;
                    } catch (error) {
                      navBarStore.updateIsShowBlockPopUp(false);
                      buttonDeleteCrawlInputRef.current.disabled = false;
                    }
                  }}
                >
                  Reset
                </button>

                <h1 className="title">Adding episode url</h1>
                <FormSubmit
                  inputEpisodeRef={inputEpisodeRef}
                  inputVideoUrlRef={inputVideoUrlRef}
                  cookies={cookies}
                  name={name}
                  setEpisodeData={setEpisodeData}
                  typeVideoSelectRef={typeVideoSelectRef}
                />
                <h1 className="title">Crawl episode</h1>
                <FormSubmitCrawl
                  buttonSubmitCrawlInputRef={buttonSubmitCrawlInputRef}
                  endEpisodeInputRef={endEpisodeInputRef}
                  startEpisodeInputRef={startEpisodeInputRef}
                  linkWatchingInputRef={linkWatchingInputRef}
                  selectCrawlInputRef={selectCrawlInputRef}
                  name={name}
                  setEpisodeData={setEpisodeData}
                  cookies={cookies}
                  selectCrawlServerVideo={selectCrawlServerVideo}
                />
              </div>
            )}
            {episodeData && episodeData.length > 0 && (
              <div>
                <h1 className="title">Latest Episodes</h1>
                <ListVideoUrl episodeData={episodeData} name={name} />
              </div>
            )}
            <a
              className="link"
              href={findingAnime.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              More information
            </a>
          </div>
        </div>
        {data.dataPromo && <VideoPromotionList data={data} />}
      </div>
    )
  );
};

function ListInformation({ arrKeys }) {
  return (
    <ul>
      {arrKeys &&
        arrKeys.map((v, index) => {
          if (typeof findingAnime[v] !== "object") {
            if (v !== "rank")
              return (
                <li key={index}>
                  <span
                    style={{
                      fontFamily: "Arial",
                    }}
                  >
                    {capitalizeString(v)}:
                  </span>{" "}
                  {`${findingAnime[v]}`}
                </li>
              );
            else
              return (
                <li
                  key={index}
                  style={{
                    color:
                      findingAnime[v] <= 1000
                        ? "Yellow"
                        : findingAnime[v] <= 2000
                        ? "#8b8bff"
                        : "inherit",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Arial",
                    }}
                  >
                    {capitalizeString(v)}:
                  </span>{" "}
                  {`${findingAnime[v]}`}
                </li>
              );
          } else {
            if (findingAnime[v] && findingAnime[v].length) {
              let check = true;
              findingAnime[v].forEach((anime) => {
                if (typeof anime === "object") {
                  check = false;
                }
              });
              if (!check) {
                const array = findingAnime[v].map((anime) => anime.name);
                return (
                  <li key={index}>
                    <span>{capitalizeString(v)}: </span>
                    {`${array.join(" || ")}`}
                  </li>
                );
              }
              return (
                <li key={index}>
                  {!/themes/g.test(v) && (
                    <ul>
                      <span>{capitalizeString(v)}: </span>
                      {`${findingAnime[v].join(" <||> ")}`}
                    </ul>
                  )}

                  {/themes/g.test(v) && (
                    <div
                      style={{
                        border: "none",
                      }}
                    >
                      <div
                        style={{
                          textTransform: "capitalize",
                          fontSize: "2rem",
                        }}
                      >
                        {v}
                      </div>
                      {findingAnime[v].map((anime, key) => {
                        return <div key={key}>{anime}</div>;
                      })}
                    </div>
                  )}
                </li>
              );
            }
            return undefined;
          }
        })}
    </ul>
  );
}

function FormSubmitCrawl({
  startEpisodeInputRef,
  endEpisodeInputRef,
  linkWatchingInputRef,
  buttonSubmitCrawlInputRef,
  selectCrawlInputRef,
  name,
  setEpisodeData,
  cookies,
  selectCrawlServerVideo,
}) {
  return (
    <div className="form-submit">
      <select
        defaultValue="animehay"
        ref={selectCrawlInputRef}
        onChange={(e) => {
          if (e.target.value === "animehay") {
            selectCrawlServerVideo.current.style.display = "block";
          } else {
            selectCrawlServerVideo.current.style.display = "none";
          }
        }}
      >
        <option value="animehay">animehay</option>
        <option value="animevsub">animevsub</option>
      </select>
      <select defaultValue="serverMoe" ref={selectCrawlServerVideo}>
        <option value="serverMoe">Moe</option>
        <option value="serverICQ">Kol</option>
      </select>
      <div className="form-limit-episode">
        <Input label="start" type="number" input={startEpisodeInputRef} />
        <Input label="end" type="number" input={endEpisodeInputRef} />
      </div>
      <Input label="Watch Url" input={linkWatchingInputRef} />
      <button
        className="btn btn-success"
        ref={buttonSubmitCrawlInputRef}
        onClick={async () => {
          const start = startEpisodeInputRef.current.value;
          const end = endEpisodeInputRef.current.value;
          const url = linkWatchingInputRef.current.value;
          const serverWeb = selectCrawlInputRef.current.value;
          const serverVideo = selectCrawlServerVideo.current.value;
          switch (serverWeb) {
            case "animehay":
              if (!url.includes("animehay.tv/phim/")) {
                return alert("Invalid url");
              }
              break;
            case "animevsub":
              if (!url.includes("animevsub.tv/phim/")) {
                return alert("Invalid url");
              }
              break;
            default:
              break;
          }
          if (
            startEpisodeInputRef.current.value.trim() === "" ||
            !startEpisodeInputRef.current.value ||
            endEpisodeInputRef.current.value.trim() === "" ||
            !endEpisodeInputRef.current.value ||
            linkWatchingInputRef.current.value.trim() === "" ||
            !linkWatchingInputRef.current.value
          ) {
            alert("start, end and watch url are required");
            return;
          }
          try {
            buttonSubmitCrawlInputRef.current.disabled = true;
            navBarStore.updateIsShowBlockPopUp(true);
            const updateMovie = await Axios.put(
              `/api/movies/${name}/episodes/crawl`,
              {
                start,
                end,
                url,
                serverWeb,
                serverVideo,
              },
              {
                headers: {
                  authorization: `Bearer ${cookies.idCartoonUser}`,
                },
              }
            );
            allowUpdatedMovie(true);
            setEpisodeData(updateMovie.data.message.episodes);
            startEpisodeInputRef.current.value = "";
            endEpisodeInputRef.current.value = "";
            navBarStore.updateIsShowBlockPopUp(false);
            buttonSubmitCrawlInputRef.current.disabled = false;
            linkWatchingInputRef.current.value =
              updateMovie.data.message.source || "";
          } catch (error) {
            startEpisodeInputRef.current.value = "";
            endEpisodeInputRef.current.value = "";
            navBarStore.updateIsShowBlockPopUp(false);
            buttonSubmitCrawlInputRef.current.disabled = false;
            allowUpdatedMovie(true);
          }
        }}
      >
        Submit
      </button>
    </div>
  );
}

function FormSubmit({
  inputEpisodeRef,
  inputVideoUrlRef,
  cookies,
  name,
  setEpisodeData,
  typeVideoSelectRef,
}) {
  return (
    <div className="form-submit">
      <select ref={typeVideoSelectRef} defaultValue="video">
        <option value="video">video</option>
        <option value="iframe">iframe</option>
      </select>
      <Input label="Number" type="number" input={inputEpisodeRef} />
      <Input label={"Video url"} input={inputVideoUrlRef} />
      <button
        className="btn btn-success"
        type="submit"
        onClick={async () => {
          const episode = parseInt(inputEpisodeRef.current.value);
          const embedUrl = inputVideoUrlRef.current.value;
          const typeVideo = typeVideoSelectRef.current.value === "video";
          const { idCartoonUser } = cookies;
          if (!episode || !embedUrl || embedUrl.trim() === "") {
            alert("Episode and Url are required");
            return;
          }
          try {
            const res = await Axios.put(
              `/api/movies/${name}/episode/${episode}`,
              {
                embedUrl,
                typeVideo,
              },
              {
                headers: {
                  authorization: `Bearer ${idCartoonUser}`,
                },
              }
            );
            allowUpdatedMovie(true);
            setEpisodeData(res.data);
            inputEpisodeRef.current.value = "";
            inputVideoUrlRef.current.value = "";
          } catch (error) {
            alert("Something went wrong");
          }
        }}
      >
        Submit
      </button>
    </div>
  );
}

function ListVideoUrl({ episodeData, name }) {
  return (
    <div className={"list-video-url"}>
      {episodeData &&
        orderBy(episodeData, ["episode"], "desc")
          .slice(0, 3)
          .map((episode, index) => {
            return (
              <Link
                key={index}
                // href={episode.embedUrl}
                to={`/anime/${name}/watch/${episode.episode}`}
                onClick={() => {
                  allowShouldFetchComment(true);
                  allowShouldFetchEpisodeMovie(true);
                }}
              >
                {episode.episode}
              </Link>
            );
          })}
    </div>
  );
}

function VideoPromotionList({ data }) {
  return (
    <div className="video-promotion-list">
      {data.dataPromo.promo &&
        data.dataPromo.promo.map((video, index) => {
          return (
            <div className="video-promotion-item" key={index}>
              <h1 className="title">{video.title}</h1>
              <iframe
                style={{ margin: "1rem 0" }}
                width="100%"
                height="500px"
                src={video.video_url.replace(/autoplay=1/g, "autoplay=0")}
                title={video.title}
              ></iframe>
            </div>
          );
        })}
    </div>
  );
}

const fetchData$ = (name) => {
  return ajax(`https://api.jikan.moe/v3/anime/${name}`).pipe(
    retry(),
    pluck("response")
  );
};

const fetchDataVideo$ = (malId) => {
  return ajax(`https://api.jikan.moe/v3/anime/${malId}/videos`).pipe(
    retry(),
    pluck("response")
  );
};

const fetchEpisodeDataVideo = async (malId) => {
  let data = await fetch(`/api/movies/${malId}/episodes`);
  data = await data.json();
  return data;
};

const fetchBoxMovieOneMovie = async (malId, idCartoonUser) => {
  let data = await Axios.get(`/api/movies/box/${malId}`, {
    headers: {
      authorization: `Bearer ${idCartoonUser}`,
    },
  });
  data = data.data;
  return data;
};

let findingAnime;

function capitalizeString(string) {
  string = string.replace("_", " ");
  return capitalize(string);
}

function handleAddBoxMovie(
  addMovieRef,
  deleteMovieRef,
  idCartoonUser,
  setBoxMovie,
  malId
) {
  return timer(0)
    .pipe(
      filter(() => addMovieRef.current),
      debounceTime(500),
      map(() => addMovieRef.current),
      switchMap((target) => {
        return fromEvent(target, "click").pipe(
          filter(() => findingAnime),
          exhaustMap(() =>
            ajax({
              method: "POST",
              url: "/api/movies/box",
              headers: {
                authorization: `Bearer ${idCartoonUser}`,
              },
              body: {
                malId: findingAnime.mal_id,
                title: findingAnime.title,
                imageUrl: findingAnime.image_url,
                episodes: findingAnime.episodes || "??",
                score: findingAnime.score,
                airing: findingAnime.airing,
              },
            }).pipe(
              pluck("response", "message"),
              catchError((err) => {
                return from([]);
              })
            )
          )
        );
      })
    )
    .subscribe((v) => {
      // console.log(v);
      setBoxMovie(v);
      handleDeleteBoxMovie(
        addMovieRef,
        deleteMovieRef,
        idCartoonUser,
        setBoxMovie,
        malId
      );
    });
}

function handleDeleteBoxMovie(
  addMovieRef,
  deleteMovieRef,
  idCartoonUser,
  setBoxMovie,
  malId
) {
  return timer(0)
    .pipe(
      filter(() => deleteMovieRef.current),
      debounceTime(500),
      map(() => deleteMovieRef.current),
      switchMap((target) => {
        return fromEvent(target, "click").pipe(
          filter(() => findingAnime),
          exhaustMap(() =>
            ajax({
              method: "DELETE",
              url: `/api/movies/box/${malId}`,
              headers: {
                authorization: `Bearer ${idCartoonUser}`,
              },
            }).pipe(
              pluck("response", "message"),
              catchError((err) => {
                return from([]);
              })
            )
          )
        );
      })
    )
    .subscribe((v) => {
      setBoxMovie(null);
      handleAddBoxMovie(
        addMovieRef,
        deleteMovieRef,
        idCartoonUser,
        setBoxMovie,
        malId
      );
    });
}

export default Name;
