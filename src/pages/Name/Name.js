import "./Name.css";

import loadable from "@loadable/component";
import CircularProgress from "@material-ui/core/CircularProgress";
import Axios from "axios";
import random from "lodash/random";
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useHistory } from "react-router-dom";
import { from } from "rxjs";
import { combineAll, tap } from "rxjs/operators";

import Input from "../../components/Input/Input";
import { characterStream } from "../../epics/character";
import {
  capitalizeString,
  fetchAnimeRecommendation$,
  fetchBoxMovieOneMovie$,
  fetchData$,
  fetchDataCharacter$,
  fetchDataVideo$,
  fetchEpisodeDataVideo$,
  fetchLargePicture$,
  handleAddBoxMovie,
  handleDeleteBoxMovie,
  nameStream,
} from "../../epics/name";
import { pageWatchStream } from "../../epics/pageWatch";
import { userStream } from "../../epics/user";

const Characters = loadable(() =>
  import("../../components/Characters/Characters")
);
const VideoPromotionList = loadable(() =>
  import("../../components/VideoPromotionList/VideoPromotionList")
);

const RelatedAnime = loadable(() =>
  import("../../components/RelatedAnime/RelatedAnime")
);
const Reviews = loadable(() => import("../../components/Reviews/Reviews"));

const Name = (props) => {
  const { name } = props.match.params;
  const history = useHistory();
  const user = userStream.currentState();
  const [cookies] = useCookies();
  const [nameState, setNameState] = useState(
    nameStream.currentState() || nameStream.initialState
  );
  const [reviewState, setReviewState] = useState(
    pageWatchStream.currentState() || pageWatchStream.initialState
  );
  const [showThemeMusic, setShowThemeMusic] = useState(false);
  const [crawlAnimeMode, setCrawlAnimeMode] = useState("animehay");
  const [toggleNavTitle, setToggleNavTitle] = useState(false);
  const [elementTitle, setElementTitle] = useState([]);

  const selectModeEngVideoRef = useRef();
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
    const subscription = pageWatchStream.subscribe(setReviewState);
    const subscription2 = nameStream.subscribe(setNameState);
    pageWatchStream.init();
    nameStream.init();
    window.scroll({ top: 0 });
    document.title = `Watch ${
      nameStream.currentState().dataInformationAnime.title
    }`;
    setShowThemeMusic(false);
    return () => {
      document.title = `My Anime Fun - Watch latest anime in high quality`;
      subscription.unsubscribe();
      subscription2.unsubscribe();
    };
  }, []);
  useEffect(() => {
    const fetchDataInfo$ = fetchData$(name).pipe(
      tap((v) => {
        document.title = `Watch ${v.title}`;
        nameStream.updateIsLoading(false, "isLoadingInfoAnime");
        nameStream.updateData({
          dataInformationAnime: v,
        });
      })
    );
    const fetchDataVideoPromo$ = fetchDataVideo$(name).pipe(
      tap(({ promo }) => {
        if (promo) {
          nameStream.updateData({
            pageVideo: promo,
          });
        }
        nameStream.updateIsLoading(false, "isLoadingVideoAnime");
      })
    );
    const fetchLargePictureUrl$ = fetchLargePicture$(name).pipe(
      tap(({ pictures }) => {
        try {
          nameStream.updateIsLoading(false, "isLoadingLargePicture");
          if (pictures) {
            const imageUrl = pictures[random(pictures.length - 1)]
              ? pictures[random(pictures.length - 1)].large
              : undefined;
            nameStream.updateData({
              dataLargePicture: imageUrl,
            });
          }
        } catch (error) {
          nameStream.updateIsLoading(false, "isLoadingLargePicture");
          console.log(error);
        }
      })
    );
    const fetchEpisodesUrlSub = fetchEpisodeDataVideo$(name)
      .pipe(
        tap((api) => {
          if (!api.error) {
            nameStream.updateIsLoading(false, "isLoadingEpisode");
            if (linkWatchingInputRef.current)
              linkWatchingInputRef.current.value = api.message.source;
            nameStream.updateData({
              dataEpisodesAnime: api.message,
            });
          } else {
            nameStream.updateIsLoading(false, "isLoadingEpisode");
            nameStream.updateData({
              dataEpisodesAnime: {},
            });
          }
        })
      )
      .subscribe();
    const fetchAnimeAppears$ = fetchAnimeRecommendation$(name).pipe(
      tap((data) => {
        nameStream.updateIsLoading(false, "isLoadingRelated");
        nameStream.updateData({
          dataRelatedAnime: data,
        });
      })
    );
    const fetchCharacters$ = fetchDataCharacter$(name).pipe(
      tap((data) => {
        nameStream.updateIsLoading(false, "isLoadingCharacter");
        characterStream.updateDataCharacter(data);
      })
    );
    let subscription;
    if (nameStream.currentState().malId !== name) {
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
      nameStream.resetState();
      subscription = from([
        fetchDataInfo$,
        fetchDataVideoPromo$,
        fetchLargePictureUrl$,
        fetchAnimeAppears$,
        fetchCharacters$,
      ])
        .pipe(combineAll())
        .subscribe(() => {
          characterStream.updatePage(1);
          nameStream.updateData({
            malId: name,
          });
        });
    }
    return () => {
      fetchEpisodesUrlSub.unsubscribe();
      subscription && subscription.unsubscribe();
      setShowThemeMusic(false);
    };
  }, [name]);
  useEffect(() => {
    const subscription = fetchBoxMovieOneMovie$(
      name,
      cookies.idCartoonUser
    ).subscribe((api) => {
      if (!api.error) {
        nameStream.updateData({
          boxMovie: api.message === null ? null : { ...api.message },
        });
        handleDeleteBoxMovie(
          addMovieRef,
          deleteMovieRef,
          cookies.idCartoonUser,
          name
        );
      } else {
        nameStream.updateData({
          boxMovie: null,
        });
        handleAddBoxMovie(
          addMovieRef,
          deleteMovieRef,
          cookies.idCartoonUser,
          name
        );
      }
    });
    return () => {
      subscription && subscription.unsubscribe();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      linkWatchingInputRef.current && (linkWatchingInputRef.current.value = "");
    };
  }, [cookies.idCartoonUser, name]);
  const arrayTagTitle = document.querySelectorAll(".title") || [];
  const a = [...arrayTagTitle];
  useEffect(() => {
    setElementTitle(a);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    a.length,
    name,
    elementTitle.length,
    reviewState.reviewsData.length,
    nameState.dataVideoPromo.length,
  ]);
  const arrKeys = Object.keys(nameState.dataInformationAnime).filter((v) => {
    let arrayExclude = [
      "title",
      "image_url",
      "url",
      "synopsis",
      "trailer_url",
      "request_hash",
      "request_cached",
      "request_cache_expiry",
      "mal_id",
    ];
    if (!showThemeMusic) {
      arrayExclude = [...arrayExclude, "opening_themes", "ending_themes"];
    }
    if (nameState.dataInformationAnime)
      if (
        document.querySelector(".button-show-more-information") &&
        nameState.dataInformationAnime.opening_themes.length === 0 &&
        nameState.dataInformationAnime.ending_themes.length === 0
      ) {
        document.querySelector(".button-show-more-information").style.display =
          "none";
      }
    return arrayExclude.indexOf(v) === -1 ? true : false;
  });
  let episodeDataDisplay = { key: "", episodeList: [] };
  Object.keys(nameState.dataEpisodesAnime).forEach((key) => {
    const episodeList = nameState.dataEpisodesAnime[key];
    if (["episodes", "episodesEng", "episodesEngDub"].includes(key)) {
      if (episodeList.length >= episodeDataDisplay.episodeList.length) {
        episodeDataDisplay = { key, episodeList: [...episodeList] };
      }
    }
  });
  let sourceFilmList;
  if (nameState.dataEpisodesAnime && nameState.dataEpisodesAnime.sourceFilmList)
    sourceFilmList = Object.keys(nameState.dataEpisodesAnime.sourceFilmList);
  return (
    nameState.dataInformationAnime && (
      <div className="anime-name-info layout">
        <h1 className="title">{nameState.dataInformationAnime.title}</h1>
        {nameState.isLoadingLargePicture !== null &&
          nameState.isLoadingLargePicture === true && (
            <CircularProgress color="secondary" size="4rem" />
          )}
        <div className="image">
          <img
            src={
              nameState.dataLargePicture ||
              "https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png"
            }
            alt="image_anime"
          />
        </div>
        <MenuTable
          elementTitle={elementTitle}
          toggleNavTitle={toggleNavTitle}
        />
        <div className="menu-control">
          {episodeDataDisplay && episodeDataDisplay.episodeList.length > 0 && (
            <Link
              className="btn btn-success"
              to={
                "/anime/" +
                name +
                `/watch/${episodeDataDisplay.episodeList[0].episode}/${
                  episodeDataDisplay.key.replace("episodes", "") === ""
                    ? "vie"
                    : episodeDataDisplay.key.replace("episodes", "")
                }`
              }
            >
              Watch
            </Link>
          )}
          {user && (
            <span style={{ display: "inline" }}>
              {!nameState.boxMovie && (
                <span className="btn btn-primary" ref={addMovieRef}>
                  Add to Box
                </span>
              )}
              {nameState.boxMovie && (
                <span ref={deleteMovieRef} className="btn btn-danger">
                  Delete from Box
                </span>
              )}
            </span>
          )}
          <span
            className="btn btn-dark"
            onClick={() => {
              setToggleNavTitle(!toggleNavTitle);
            }}
          >
            Shortcut
          </span>
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
            <ListInformation
              arrKeys={arrKeys}
              history={history}
              isLoading={nameState.isLoadingInfoAnime}
            />
            {!showThemeMusic && (
              <button
                className="button-show-more-information"
                onClick={() => {
                  setShowThemeMusic(true);
                }}
              >
                Show More Information
              </button>
            )}
          </div>
          <div className="box-content">
            <h1 style={{ margin: "0" }} className="title">
              Summary
            </h1>
            <div className="content">
              {nameState.dataInformationAnime.synopsis ||
                "(No summary added yet)"}
            </div>
            {nameState.isLoadingEpisode !== null &&
              nameState.isLoadingEpisode === true && (
                <div>
                  <CircularProgress color="secondary" size="4rem" />
                </div>
              )}
            {nameState.isLoadingEpisode === false &&
              episodeDataDisplay &&
              episodeDataDisplay.episodeList.length > 0 && (
                <div>
                  <h1 className="title">Latest Episodes</h1>
                  <ListVideoUrl
                    episodeData={episodeDataDisplay.episodeList}
                    name={name}
                    keyListEpisode={episodeDataDisplay.key}
                  />
                </div>
              )}
            {user && user.role === "Admin" && (
              <div className="admin-section">
                <h1 className="title">Adding episode url</h1>
                <FormSubmit
                  inputEpisodeRef={inputEpisodeRef}
                  inputVideoUrlRef={inputVideoUrlRef}
                  cookies={cookies}
                  name={name}
                  episodeData={nameState.dataEpisodesAnime}
                  typeVideoSelectRef={typeVideoSelectRef}
                />
                <h1 className="title">Crawl episode</h1>
                <ul>
                  {sourceFilmList &&
                    sourceFilmList.map((sourceFilmKey, index) => (
                      <li key={index}>
                        {sourceFilmKey}:{" "}
                        {
                          nameState.dataEpisodesAnime.sourceFilmList[
                            sourceFilmKey
                          ]
                        }
                      </li>
                    ))}
                </ul>
                <FormSubmitCrawl
                  buttonSubmitCrawlInputRef={buttonSubmitCrawlInputRef}
                  endEpisodeInputRef={endEpisodeInputRef}
                  startEpisodeInputRef={startEpisodeInputRef}
                  linkWatchingInputRef={linkWatchingInputRef}
                  selectCrawlInputRef={selectCrawlInputRef}
                  name={name}
                  cookies={cookies}
                  selectCrawlServerVideo={selectCrawlServerVideo}
                  crawlAnimeMode={crawlAnimeMode}
                  setCrawlAnimeMode={setCrawlAnimeMode}
                  selectModeEngVideoRef={selectModeEngVideoRef}
                />
                <button
                  className="btn btn-danger"
                  ref={buttonDeleteCrawlInputRef}
                  onClick={async () => {
                    buttonDeleteCrawlInputRef.current.disabled = true;
                    try {
                      await Axios.delete(`/api/movies/${name}`, {
                        headers: {
                          authorization: `Bearer ${cookies.idCartoonUser}`,
                        },
                      });
                      nameStream.updateData({
                        dataEpisodesAnime: {},
                      });
                      buttonDeleteCrawlInputRef.current.disabled = false;
                    } catch (error) {
                      buttonDeleteCrawlInputRef.current.disabled = false;
                    }
                  }}
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
        <Characters lazy={true} isLoading={nameState.isLoadingCharacter} />
        <RelatedAnime isLoading={nameState.isLoadingRelated} />
        {nameState.dataVideoPromo && (
          <VideoPromotionList
            data={nameState.dataVideoPromo}
            isLoading={nameState.isLoadingVideoAnime}
          />
        )}
        <Reviews malId={name} />
      </div>
    )
  );
};

function MenuTable({ elementTitle, toggleNavTitle }) {
  return (
    <div
      className="tag-scrolling-nav"
      style={{
        maxHeight: toggleNavTitle ? "2000px" : "0",
        boxShadow: toggleNavTitle ? "0 0 4px 1px white" : "none",
      }}
    >
      {elementTitle &&
        elementTitle.slice(1, elementTitle.length).map((e, key) => (
          <div
            key={key}
            className="tag-scrolling-nav_item"
            onClick={() => {
              e.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            {e.innerText}
          </div>
        ))}
    </div>
  );
}

function ListInformation({ arrKeys, history, isLoading }) {
  return (
    <ul>
      {isLoading !== null && isLoading === true && (
        <CircularProgress color="secondary" size="4rem" />
      )}
      {isLoading === false &&
        arrKeys &&
        arrKeys.map((v, index) => {
          if (
            typeof nameStream.currentState().dataInformationAnime[v] !==
            "object"
          ) {
            if (v !== "rank")
              return (
                <li key={index} style={{ lineHeight: "2.3rem" }}>
                  <span
                    style={{
                      fontFamily: "Arial",
                      padding: "10px",
                      backgroundColor: "#353940",
                      borderRadius: "10px",
                    }}
                  >
                    {capitalizeString(v)}
                  </span>{" "}
                  {`${nameStream.currentState().dataInformationAnime[v]}`}
                </li>
              );
            else
              return (
                <li key={index} style={{ lineHeight: "2.3rem" }}>
                  <span
                    style={{
                      fontFamily: "Arial",
                      padding: "10px",
                      backgroundColor: "#353940",
                      borderRadius: "10px",
                    }}
                  >
                    {capitalizeString(v)}
                  </span>{" "}
                  <span
                    style={{
                      color:
                        nameStream.currentState().dataInformationAnime[v] <=
                        1000
                          ? "Yellow"
                          : nameStream.currentState().dataInformationAnime[v] <=
                            2000
                          ? "#8b8bff"
                          : "inherit",
                    }}
                  >
                    {`${nameStream.currentState().dataInformationAnime[v]}`}
                  </span>
                </li>
              );
          } else {
            if (
              nameStream.currentState().dataInformationAnime[v] &&
              nameStream.currentState().dataInformationAnime[v].length
            ) {
              let check = true;
              nameStream
                .currentState()
                .dataInformationAnime[v].forEach((anime) => {
                  if (typeof anime === "object") {
                    check = false;
                  }
                });
              if (!check) {
                const array = nameStream.currentState().dataInformationAnime[v];
                return (
                  <li key={index}>
                    <ul className="title-synonym-list">
                      <span className="title-capitalize">
                        {capitalizeString(v)}
                      </span>
                      {array.map((anime, index) => {
                        return (
                          <li
                            className={
                              v === "genres" ||
                              v === "producers" ||
                              v === "studios" ||
                              v === "licensors"
                                ? "click-able-info"
                                : ""
                            }
                            key={index}
                            onClick={() => {
                              if (v === "genres") {
                                history.push("/genre/" + anime.mal_id);
                              }
                              if (v === "producers") {
                                history.push("/producer/" + anime.mal_id);
                              }
                              if (v === "studios") {
                                history.push("/studio/" + anime.mal_id);
                              }
                              if (v === "licensors") {
                                history.push("/licensor/" + anime.mal_id);
                              }
                            }}
                          >
                            {anime.name}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              }
              return (
                <li key={index}>
                  {!/themes/g.test(v) && (
                    <ul className="title-synonym-list">
                      <span className="title-capitalize">
                        {capitalizeString(v)}
                      </span>
                      {nameStream
                        .currentState()
                        .dataInformationAnime[v].map((nameAnime, index) => {
                          return <li key={index}>{nameAnime}</li>;
                        })}
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
                      {nameStream
                        .currentState()
                        .dataInformationAnime[v].map((anime, key) => {
                          return <div key={key}>{anime}</div>;
                        })}
                    </div>
                  )}
                </li>
              );
            }
            if (
              nameStream.currentState().dataInformationAnime[v] &&
              nameStream.currentState().dataInformationAnime[v].length !== 0
            ) {
              if (v === "related") {
                const related = nameStream.currentState().dataInformationAnime[
                  v
                ];
                return Object.keys(related).map((key) => (
                  <li key={key}>
                    <ul className="title-synonym-list">
                      <span className="title-capitalize">
                        {capitalizeString(key)}
                      </span>
                      {related[key].map((anime, index) => {
                        return (
                          <li
                            className={
                              anime.type === "anime" ? "click-able-info" : null
                            }
                            key={index}
                            onClick={() => {
                              history.push("/anime/" + anime.mal_id);
                            }}
                          >
                            {anime.name}{" "}
                            {anime.type !== "anime" && (
                              <span>({capitalizeString(anime.type)})</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ));
              }
              if (v === "aired") {
                const aired = nameStream.currentState().dataInformationAnime[v];
                return (
                  <li style={{ lineHeight: "2.3rem" }} key={index}>
                    <span
                      style={{
                        fontFamily: "Arial",
                        padding: "10px",
                        backgroundColor: "rgb(53, 57, 64)",
                        borderRadius: "10px",
                        textTransform: "capitalize",
                      }}
                    >
                      {v}
                    </span>{" "}
                    {aired.prop.from.month &&
                      aired.prop.from.day &&
                      aired.prop.from.year && (
                        <span>
                          {aired.prop.from.month}/{aired.prop.from.day}/
                          {aired.prop.from.year}
                        </span>
                      )}
                    {(!aired.prop.from.month ||
                      !aired.prop.from.day ||
                      !aired.prop.from.year) && <span>??</span>}{" "}
                    -{" "}
                    {aired.prop.to.month &&
                      aired.prop.to.day &&
                      aired.prop.to.year && (
                        <span>
                          {aired.prop.to.month}/{aired.prop.to.day}/
                          {aired.prop.to.year}
                        </span>
                      )}
                    {(!aired.prop.to.month ||
                      !aired.prop.to.day ||
                      !aired.prop.to.year) && <span>??</span>}
                  </li>
                );
              }
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
  cookies,
  selectCrawlServerVideo,
  crawlAnimeMode,
  setCrawlAnimeMode,
  selectModeEngVideoRef,
}) {
  const [error, setError] = useState(null);
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
          setCrawlAnimeMode(e.target.value);
        }}
      >
        <option value="animehay">animehay</option>
        <option value="animevsub">animevsub</option>
        <option value="gogostream">gogostream</option>
      </select>
      <select defaultValue="serverMoe" ref={selectCrawlServerVideo}>
        <option value="serverMoe">Moe</option>
        <option value="serverICQ">Kol</option>
      </select>
      {crawlAnimeMode === "gogostream" && (
        <select defaultValue="sub" ref={selectModeEngVideoRef}>
          <option value="sub">Sub</option>
          <option value="dub">Dub</option>
        </select>
      )}
      <div className="form-limit-episode">
        <Input
          label="start"
          type="number"
          input={startEpisodeInputRef}
          error={error}
        />
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
          const isDub = selectModeEngVideoRef.current
            ? selectModeEngVideoRef.current.value === "dub"
            : false;
          // console.log(isDub);
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
            case "gogostream":
              if (
                !url.includes("gogo-stream.com/videos/") ||
                (!/-dub-episode-[0-9]+/.test(url) && isDub === true) ||
                (/-dub-episode-[0-9]+/.test(url) && isDub === false)
              ) {
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
            const updateMovie = await Axios.put(
              `/api/movies/${name}/episodes/crawl`,
              {
                start,
                end,
                url,
                serverWeb,
                serverVideo,
                isDub,
              },
              {
                headers: {
                  authorization: `Bearer ${cookies.idCartoonUser}`,
                },
              }
            );
            nameStream.updateData({
              dataEpisodesAnime: updateMovie.data.message,
            });
            setError(null);
            startEpisodeInputRef.current.value = "";
            endEpisodeInputRef.current.value = "";
            buttonSubmitCrawlInputRef.current.disabled = false;
            linkWatchingInputRef.current &&
              (linkWatchingInputRef.current.value =
                updateMovie.data.message.source || "");
          } catch (error) {
            if (
              error &&
              error.response &&
              error.response.data &&
              error.response.data.error
            ) {
              setError(error.response.data.error);
            }
            startEpisodeInputRef.current.value = "";
            endEpisodeInputRef.current.value = "";
            linkWatchingInputRef.current &&
              (buttonSubmitCrawlInputRef.current.disabled = false);
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
  episodeData,
  typeVideoSelectRef,
}) {
  return (
    <div className="form-submit">
      <select ref={typeVideoSelectRef} defaultValue="video">
        <option value="video">video</option>
        <option value="iframe">iframe</option>
      </select>
      <select
        defaultValue="vi"
        className="select-language-anime"
        onChange={(e) => {
          const languageSelect = e.target;
          const value = languageSelect.value;
          const modeAnime = document.querySelector(".select-mode-anime");
          // console.log(value);
          if (value === "eng") {
            modeAnime.style.display = "block";
          } else {
            modeAnime.style.display = "none";
          }
        }}
      >
        <option value="eng">Eng</option>
        <option value="vi">Vi</option>
      </select>
      <select
        defaultValue="sub"
        className="select-mode-anime"
        style={{ display: "none" }}
      >
        <option value="sub">Sub</option>
        <option value="dub">Dub</option>
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
          const language = document.querySelector(".select-language-anime")
            .value;
          const isDub =
            document.querySelector(".select-mode-anime").value === "dub";
          const { idCartoonUser } = cookies;
          if (!episode || !embedUrl || embedUrl.trim() === "") {
            alert("Episode and Url are required");
            return;
          }
          try {
            const res = await Axios.put(
              `/api/movies/${name}/episode/${episode}/${language}/${isDub}`,
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
            const data = episodeData;
            if (language === "vi") {
              nameStream.updateData({
                dataEpisodesAnime: {
                  ...data,
                  episodes: res.data,
                },
              });
            }
            if (language === "eng") {
              if (isDub) {
                nameStream.updateData({
                  dataEpisodesAnime: {
                    ...data,
                    episodesEngDub: res.data,
                  },
                });
              } else {
                nameStream.updateData({
                  dataEpisodesAnime: {
                    ...data,
                    episodesEng: res.data,
                  },
                });
              }
            }
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

function ListVideoUrl({ episodeData, name, keyListEpisode }) {
  return (
    <div className={"list-video-url"}>
      {episodeData &&
        episodeData
          .map((data) => ({
            ...data,
            episode: data.episode,
          }))
          .slice(episodeData.length - 6, episodeData.length)
          .reverse()
          .map((episode, index) => {
            return (
              <Link
                key={index}
                // href={episode.embedUrl}
                to={`/anime/${name}/watch/${episode.episode}/${
                  keyListEpisode.replace("episodes", "") === ""
                    ? "vie"
                    : keyListEpisode.replace("episodes", "")
                }`}
              >
                {episode.episode}
              </Link>
            );
          })}
    </div>
  );
}

export default Name;
