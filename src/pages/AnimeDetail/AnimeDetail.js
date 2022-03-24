import "./AnimeDetail.css";

import loadable from "@loadable/component";
import CircularProgress from "@material-ui/core/CircularProgress";
import Axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useHistory } from "react-router-dom";
import { ajax } from "rxjs/ajax";

import FormSubmit from "../../components/FormSubmit/FormSubmit";
import FormSubmitCrawl from "../../components/FormSubmitCrawl/FormSubmitCrawl";
import ListVideoUrl from "../../components/ListVideoUrl/ListVideoUrl";
import MenuTable from "../../components/MenuTable/MenuTable";
import { animeDetailStream } from "../../epics/animeDetail";
import { userStream } from "../../epics/user";
import {
  useFetchBoxMovieOneMovie,
  useFetchData,
  useInitAnimeDetailState,
} from "../../Hook/animeDetail";

const ListInformation = loadable(() =>
  import("../../components/ListInformation/ListInformation")
);

const ListImageAnimeDetail = loadable(() =>
  import("../../components/ListImageAnimeDetail/ListImageAnimeDetail")
);

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

const AnimeDetail = (props) => {
  const { name } = props.match.params;
  const malId = parseInt(name);
  const history = useHistory();
  const user = userStream.currentState();
  const [cookies] = useCookies();
  const [animeDetailState, setAnimeDetailState] = useState(
    animeDetailStream.currentState()
  );
  const [showThemeMusic, setShowThemeMusic] = useState(false);
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
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  useEffect(() => {
    if (animeDetailState.dataLargePictureList[0]) {
      document.body.style.backgroundImage = `url(${animeDetailState.dataLargePictureList[0]})`;
      document.body.style.backgroundSize = "contain";
    }
    return () => {
      document.body.style.backgroundImage = `url(/background.jpg)`;
      document.body.style.backgroundSize = "cover";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useInitAnimeDetailState(setAnimeDetailState);
  useFetchData(setShowThemeMusic, linkWatchingInputRef, malId, history);
  useFetchBoxMovieOneMovie(
    cookies,
    malId,
    addMovieRef,
    deleteMovieRef,
    linkWatchingInputRef,
    animeDetailState.isLoadingLargePicture
  );
  useEffect(() => {
    const { dataInformationAnime } = animeDetailStream.currentState();
    const { opening_themes, ending_themes } = dataInformationAnime;
    if (
      ending_themes &&
      opening_themes &&
      ending_themes.length <= 3 &&
      opening_themes.length <= 3
    )
      setShowThemeMusic(true);
  }, [malId, showThemeMusic]);
  const arrayTagTitle = document.querySelectorAll(".title") || [];
  const a = [...arrayTagTitle];
  useEffect(() => {
    setElementTitle(a);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a.length, malId, elementTitle.length]);
  var { episodeDataDisplay, arrKeys, sourceFilmList } = deformData(
    animeDetailState,
    showThemeMusic
  );
  return (
    animeDetailState.dataInformationAnime && (
      <div className="anime-name-info layout">
        <h1 className="title">{animeDetailState.dataInformationAnime.title}</h1>
        {animeDetailState.isLoadingLargePicture !== null &&
          animeDetailState.isLoadingLargePicture === true && (
            <CircularProgress color="secondary" size="4rem" />
          )}
        <div className="image">
          {animeDetailState.dataLargePictureList.length > 1 && (
            <ListImageAnimeDetail
              listImage={animeDetailState.dataLargePictureList}
              isLoading={animeDetailState.isLoadingLargePicture}
            />
          )}
          {animeDetailState.dataLargePictureList.length === 1 && (
            <img
              src={animeDetailState.dataLargePictureList[0]}
              alt={"image_anime"}
              style={{
                width: "100%",
              }}
            ></img>
          )}
          {animeDetailState.dataLargePictureList.length < 1 &&
            animeDetailState.dataInformationAnime.images && (
              <img
                src={
                  animeDetailState.dataInformationAnime.images.jpg
                    .large_image_url
                }
                alt={"image_anime"}
                style={{
                  width: "100%",
                }}
              ></img>
            )}
        </div>
        <MenuTable
          elementTitle={elementTitle}
          toggleNavTitle={toggleNavTitle}
        />
        <div className="menu-control">
          {episodeDataDisplay && episodeDataDisplay.episodeList.length > 0 && (
            <Link
              to={
                "/anime/" +
                malId +
                `/watch/${episodeDataDisplay.episodeList[0].episode}/${
                  episodeDataDisplay.key.replace("episodes", "") === ""
                    ? "vie"
                    : episodeDataDisplay.key.replace("episodes", "")
                }`
              }
            >
              <button className="btn btn-success">Watch</button>
            </Link>
          )}
          {user && !animeDetailState.isLoadingLargePicture && (
            <span style={{ display: "inline" }}>
              {!animeDetailState.boxMovie && (
                <button className="btn btn-primary" ref={addMovieRef}>
                  Add to Box
                </button>
              )}
              {animeDetailState.boxMovie && (
                <button ref={deleteMovieRef} className="btn btn-danger">
                  Delete from Box
                </button>
              )}
            </span>
          )}
          {!animeDetailState.isLoadingLargePicture && (
            <button
              disabled={isSendingRequest}
              className="btn btn-request"
              onClick={() => {
                if (
                  animeDetailState.dataInformationAnime.status ===
                  "Not yet aired"
                ) {
                  return alert("This anime is not aired yet");
                }
                if (
                  animeDetailState.dataInformationAnime.episodes ===
                  episodeDataDisplay.episodeList.length
                ) {
                  return alert("This anime has been updated");
                }
                if (
                  user &&
                  (animeDetailState.dataInformationAnime.status ===
                    "Currently Airing" ||
                    animeDetailState.dataInformationAnime.status ===
                      "Finished Airing") &&
                  animeDetailState.dataInformationAnime.episodes !==
                    episodeDataDisplay.episodeList.length
                ) {
                  const { dataInformationAnime } = animeDetailState;
                  setIsSendingRequest(true);
                  ajax({
                    url: "/api/movies/request",
                    method: "POST",
                    headers: {
                      authorization: `Bearer ${cookies.idCartoonUser}`,
                    },
                    body: {
                      malId: malId.toString(),
                      title: dataInformationAnime.title,
                      imageUrl:
                        dataInformationAnime.images.webp.large_image_url ||
                        dataInformationAnime.images.jpg.large_image_url ||
                        dataInformationAnime.image_url,
                      score: dataInformationAnime.score,
                      synopsis: dataInformationAnime.synopsis,
                    },
                  }).subscribe((res) => {
                    if (!res.error) {
                      alert("Your request has been filed");
                      setIsSendingRequest(false);
                    }
                  });
                } else {
                  alert("require Login");
                }
              }}
            >
              Request
            </button>
          )}
          <button
            className="btn btn-dark"
            onClick={() => {
              setToggleNavTitle(!toggleNavTitle);
            }}
          >
            Shortcut
          </button>
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
              isLoading={animeDetailState.isLoadingInfoAnime}
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
              Synopsis
            </h1>
            <div className="content">
              {animeDetailState.dataInformationAnime.synopsis ||
                "(No synopsis added yet)"}
            </div>
            {animeDetailState.dataInformationAnime.background && (
              <div>
                <h1 style={{ marginBottom: "0" }} className="title">
                  Background
                </h1>
                <div className="content">
                  {animeDetailState.dataInformationAnime.background}
                </div>
              </div>
            )}
            {animeDetailState.isLoadingEpisode !== null &&
              animeDetailState.isLoadingEpisode === true && (
                <div>
                  <CircularProgress color="secondary" size="4rem" />
                </div>
              )}
            {animeDetailState.isLoadingEpisode === false &&
              episodeDataDisplay &&
              episodeDataDisplay.episodeList.length > 0 && (
                <div>
                  <h1 className="title">Latest Episodes</h1>
                  <ListVideoUrl
                    episodeData={episodeDataDisplay.episodeList}
                    malId={malId}
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
                  malId={malId}
                  episodeData={animeDetailState.dataEpisodesAnime}
                  typeVideoSelectRef={typeVideoSelectRef}
                />
                <h1 className="title">Crawl episode</h1>
                <ul>
                  {sourceFilmList &&
                    sourceFilmList.map((sourceFilmKey, index) => (
                      <li key={index}>
                        {sourceFilmKey}:{" "}
                        {
                          animeDetailState.dataEpisodesAnime.sourceFilmList[
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
                  malId={malId}
                  cookies={cookies}
                  selectModeEngVideoRef={selectModeEngVideoRef}
                />
                <button
                  className="btn btn-danger"
                  ref={buttonDeleteCrawlInputRef}
                  onClick={async () => {
                    buttonDeleteCrawlInputRef.current.disabled = true;
                    try {
                      await Axios.delete(`/api/movies/${malId}`, {
                        headers: {
                          authorization: `Bearer ${cookies.idCartoonUser}`,
                        },
                      });
                      animeDetailStream.updateData({
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
        <Characters
          lazy={true}
          isLoading={animeDetailState.isLoadingCharacter}
        />
        <RelatedAnime isLoading={animeDetailState.isLoadingRelated} />
        {animeDetailState.dataVideoPromo && (
          <VideoPromotionList
            data={animeDetailState.dataVideoPromo}
            isLoading={animeDetailState.isLoadingVideoAnime}
          />
        )}
        <Reviews malId={malId} />
      </div>
    )
  );
};

function deformData(animeDetailState, showThemeMusic) {
  let arrKeys = Object.keys(animeDetailState.dataInformationAnime).filter(
    (v) => {
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
        "background",
        "external_links",
        "opening_themes",
        "ending_themes",
        "type_data",
      ];
      if (
        animeDetailState.dataInformationAnime &&
        animeDetailState.dataInformationAnime.opening_themes &&
        animeDetailState.dataInformationAnime.ending_themes
      )
        if (
          document.querySelector(".button-show-more-information") &&
          animeDetailState.dataInformationAnime.opening_themes.length === 0 &&
          animeDetailState.dataInformationAnime.ending_themes.length === 0
        ) {
          document.querySelector(
            ".button-show-more-information"
          ).style.display = "none";
        }
      return arrayExclude.indexOf(v) === -1 ? true : false;
    }
  );
  if (!showThemeMusic) {
    arrKeys = [...arrKeys, "external_links"];
  }
  if (showThemeMusic) {
    arrKeys = [...arrKeys, "external_links", "opening_themes", "ending_themes"];
  }
  let episodeDataDisplay = { key: "", episodeList: [] };
  Object.keys(animeDetailState.dataEpisodesAnime).forEach((key) => {
    const episodeList = animeDetailState.dataEpisodesAnime[key];
    if (["episodes", "episodesEng", "episodesEngDub"].includes(key)) {
      if (episodeList.length >= episodeDataDisplay.episodeList.length) {
        episodeDataDisplay = { key, episodeList: [...episodeList] };
      }
    }
  });
  let sourceFilmList;
  if (
    animeDetailState.dataEpisodesAnime &&
    animeDetailState.dataEpisodesAnime.sourceFilmList
  )
    sourceFilmList = Object.keys(
      animeDetailState.dataEpisodesAnime.sourceFilmList
    );
  return { episodeDataDisplay, arrKeys, sourceFilmList };
}

export default AnimeDetail;
