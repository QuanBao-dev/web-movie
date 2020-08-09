import "./Name.css";

import Axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

import Input from "../components/Input/Input";
import { userStream } from "../epics/user";
import { allowUpdatedMovie } from "../store/home";

import { ajax } from "rxjs/ajax";
import { timer, from, fromEvent } from "rxjs";
import {
  exhaustMap,
  pluck,
  catchError,
  map,
  filter,
  debounceTime,
  switchMap,
} from "rxjs/operators";
import { allowShouldFetchComment } from "../store/comment";
import { orderBy } from "lodash";
import { allowShouldFetchEpisodeMovie } from "../store/pageWatch";

const fetchData = async (name) => {
  let data = await fetch(`https://api.jikan.moe/v3/anime/${name}`);
  data = await data.json();
  return data;
};

const fetchDataVideo = async (malId) => {
  let data = await fetch(`https://api.jikan.moe/v3/anime/${malId}/videos`);
  data = await data.json();
  return data;
};

const fetchEpisodeDataVideo = async (malId) => {
  let data = await fetch(`http://localhost:5000/api/movies/${malId}/episodes`);
  data = await data.json();
  return data;
};

const fetchBoxMovieOneMovie = async (malId, idCartoonUser) => {
  let data = await Axios.get(`http://localhost:5000/api/movies/box/${malId}`, {
    headers: {
      authorization: `Bearer ${idCartoonUser}`,
    },
  });
  data = data.data;
  return data;
};

let findingAnime;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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
              url: "http://localhost:5000/api/movies/box",
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
      console.log(v);
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
              url: `http://localhost:5000/api/movies/box/${malId}`,
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
const Name = (props) => {
  const { name } = props.match.params;
  const controlBoxMovieRef = useRef();
  const addMovieRef = useRef();
  const deleteMovieRef = useRef();
  const [data, setData] = useState({});
  const [cookies] = useCookies();
  const [episodeData, setEpisodeData] = useState();
  const [boxMovie, setBoxMovie] = useState();
  const user = userStream.currentState();
  const inputVideoUrlRef = useRef();
  const inputEpisodeRef = useRef();
  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    scroll({
      top: 0,
      behavior: "smooth",
    });
    let subscription;
    fetchData(name)
      .then((v) => {
        if (v.status !== 403) {
          setData(v);
          // console.log({ v });
          return v;
        }
      })
      .then(async (anime) => {
        const api = await fetchDataVideo(anime.mal_id);
        setData({
          ...anime,
          dataPromo: api,
        });
        return anime.mal_id;
      })
      .then(async (malId) => {
        const api = await fetchEpisodeDataVideo(malId);
        // console.log(api);
        setEpisodeData(api.message);
        return malId;
      })
      .then(async (malId) => {
        try {
          const api = await fetchBoxMovieOneMovie(malId, cookies.idCartoonUser);
          controlBoxMovieRef.current.style.display = "inline";
          setBoxMovie(api.message);
          subscription = handleDeleteBoxMovie(
            addMovieRef,
            deleteMovieRef,
            cookies.idCartoonUser,
            setBoxMovie,
            malId
          );
        } catch (error) {
          controlBoxMovieRef.current.style.display = "inline";
          subscription = handleAddBoxMovie(
            addMovieRef,
            deleteMovieRef,
            cookies.idCartoonUser,
            setBoxMovie,
            malId
          );
        }
      })
      .catch((err) => {});
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
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
    <div className="layout">
      {findingAnime && (
        <div className="anime-name-info">
          <div className="title">{findingAnime.title}</div>
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
            <Link
              className="btn btn-success"
              onClick={() => allowShouldFetchComment(true)}
              to={"/anime/" + findingAnime.mal_id + `/watch/1`}
            >
              Watch
            </Link>
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
            )}{" "}
          </div>
          <div className="box">
            <div className="box-info">
              <div>Thong tin</div>
              <ul>
                {arrKeys &&
                  arrKeys.map((v, index) => {
                    if (typeof findingAnime[v] !== "object") {
                      return (
                        <li key={index}>
                          <span
                            style={{
                              fontFamily: "Arial",
                            }}
                          >
                            {capitalizeFirstLetter(v)}:
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
                          const array = findingAnime[v].map(
                            (anime) => anime.name
                          );
                          return (
                            <li key={index}>
                              <span
                                style={{
                                  color: "white",
                                }}
                              >
                                {capitalizeFirstLetter(v)}:{" "}
                              </span>
                              {`${array.join(" || ")}`}
                            </li>
                          );
                        }
                        return (
                          <li key={index}>
                            {!/themes/g.test(v) && (
                              <ul>
                                <span
                                  style={{
                                    color: "white",
                                  }}
                                >
                                  {capitalizeFirstLetter(v)}:{" "}
                                </span>
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
            </div>
            <div className="box-content">
              <div className="title">Noi dung</div>
              <div className="content">{findingAnime.synopsis}</div>
              {user && user.role === "Admin" && (
                <div className="admin-section">
                  <h1>Adding episodes url</h1>
                  <div className="form-submit">
                    <input type="number" ref={inputEpisodeRef} />
                    <Input label={"Video url"} input={inputVideoUrlRef} />
                    <button
                      type="submit"
                      onClick={async () => {
                        const episode = parseInt(inputEpisodeRef.current.value);
                        const embedUrl = inputVideoUrlRef.current.value;
                        const { idCartoonUser } = cookies;
                        if (
                          !episode ||
                          episode === "" ||
                          !embedUrl ||
                          embedUrl === ""
                        ) {
                          alert("Episode and Url is required");
                          return;
                        }
                        try {
                          const res = await Axios.put(
                            `http://localhost:5000/api/movies/${name}/episode/${episode}`,
                            {
                              embedUrl,
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
                </div>
              )}
              {episodeData && episodeData.length > 0 && (
                <div>
                  <div className="title">Latest Episodes</div>
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
          {data.dataPromo && (
            <div className="video-promotion-list">
              {data.dataPromo.promo &&
                data.dataPromo.promo.map((video, index) => {
                  return (
                    <div className="video-promotion-item" key={index}>
                      <div className="title">{video.title}</div>
                      <iframe
                        style={{ margin: "1rem 0" }}
                        width="100%"
                        height="500px"
                        src={video.video_url.replace(
                          /autoplay=1/g,
                          "autoplay=0"
                        )}
                        title={video.title}
                      ></iframe>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Name;
