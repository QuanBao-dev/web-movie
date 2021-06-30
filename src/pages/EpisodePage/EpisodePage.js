/* eslint-disable eqeqeq */
import "./EpisodePage.css";

import loadable from "@loadable/component";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { fetchEpisodesOfMovie$, pageWatchStream } from "../../epics/pageWatch";
import { theaterStream } from "../../epics/theater";
import { userStream } from "../../epics/user";
import { ajax } from "rxjs/ajax";
import { catchError, pluck, retry } from "rxjs/operators";
import { of } from "rxjs";
import { animeDetailStream } from "../../epics/animeDetail";
import { chatStream } from "../../epics/comment";
const Comment = loadable(() => import("../../components/Comment/Comment"));
const Chat = loadable(() => import("../../components/Chat/Chat"), {
  fallback: (
    <CircularProgress
      color="secondary"
      size="7rem"
      style={{ margin: "1rem" }}
    />
  ),
});
const VideoPlayerSection = loadable(
  () => import("../../components/VideoPlayerSection/VideoPlayerSection"),
  {
    fallback: (
      <CircularProgress
        color="inherit"
        size="7rem"
        style={{ margin: "1rem" }}
      />
    ),
  }
);

const EpisodePage = (props) => {
  const { malId, episode, mode } = props.match.params;
  const history = useHistory();
  const [pageWatchState, setPageWatchState] = useState(
    pageWatchStream.initialState
  );
  const [isDisplayVietSub, setIsDisplayVietSub] = useState(false);
  const [isDisplayEngSub, setIsDisplayEngSub] = useState(false);
  const [isDisplayEngDub, setIsDisplayEngDub] = useState(false);

  const user = userStream.currentState();
  useEffect(() => {
    pageWatchStream.updateSwitchVideo(false);
  }, [episode, mode]);
  useEffect(() => {
    const subscription = pageWatchStream.subscribe(setPageWatchState);
    pageWatchStream.init();
    if (mode === "Eng") {
      setIsDisplayEngSub(true);
    } else if (mode === "EngDub") {
      setIsDisplayEngDub(true);
    } else {
      setIsDisplayVietSub(true);
    }
    window.scroll({ top: 0 });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (
      pageWatchState.title &&
      ["Eng", "vie", "EngDub"].includes(mode) &&
      episode
    )
      document.title = `Watch ${pageWatchState.title} Episode ${episode} ${
        mode === "Eng"
          ? "Eng Subbed"
          : mode === "vie"
          ? "Vie Subbed"
          : "Eng Dubbed"
      } on MyAnimeFun`;
    return () => {
      document.title = `My Anime Fun - Watch latest anime in high quality`;
    };
  }, [episode, malId, pageWatchState.title, mode]);
  useEffect(() => {
    if (pageWatchStream.currentState().malId !== malId) {
      pageWatchStream.resetState();
      chatStream.updateData({
        messages: [],
        currentPage: 1,
        lastPageComment: 1,
      });
    }
  }, [malId]);
  useEffect(() => {
    if (user)
      theaterStream.socket.emit("user-join-watch", malId, user.username);
    let fetchEpisodesSub, fetchTitleAnimeSub;
    if (
      animeDetailStream.currentState().malId === malId &&
      !!animeDetailStream.currentState().dataLargePicture
    ) {
      pageWatchStream.updateEpisodes(
        animeDetailStream.currentState().dataEpisodesAnime
      );
      pageWatchStream.updateTitle(
        animeDetailStream.currentState().dataInformationAnime.title
      );
      pageWatchStream.updateImageUrl(
        animeDetailStream.currentState().dataLargePicture
      );
      pageWatchStream.updateInfoPageWatch(malId);
    } else {
      fetchEpisodesSub = fetchEpisodesOfMovie$(malId).subscribe((v) => {
        pageWatchStream.updateEpisodes(v);
        pageWatchStream.updateInfoPageWatch(malId);
      });
      fetchTitleAnimeSub = fetchTitle$(malId).subscribe((v) => {
        pageWatchStream.updateTitle(v.title);
        pageWatchStream.updateImageUrl(v.image_url);
      });
    }
    return () => {
      fetchTitleAnimeSub && fetchTitleAnimeSub.unsubscribe();
      fetchEpisodesSub && fetchEpisodesSub.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [malId]);
  let currentEpisode = {};
  let episodes = [];
  if (mode === "vie") {
    episodes = pageWatchState.episodes.episodes;
  } else if (mode === "Eng") {
    episodes = pageWatchState.episodes.episodesEng;
  } else if (mode === "EngDub") {
    episodes = pageWatchState.episodes.episodesEngDub;
  }
  if (episodes)
    currentEpisode = episodes.find((ep) => {
      ep.episode = parseFloat(ep.episode);
      return ep.episode == episode;
    });
  let episodeIndex = 0;
  if (episodes)
    episodeIndex = episodes.findIndex((data) => data.episode == episode);
  return (
    <div className="container-episode-movie">
      <div
        className="button-go-back"
        onClick={() => {
          history.push("/anime/" + malId);
        }}
      >
        <i className="fas fa-arrow-left"></i>
      </div>
      {pageWatchState.title &&
        ["Eng", "vie", "EngDub"].includes(mode) &&
        episode && (
          <h1 className="episode-page__title">
            <div className="title-anime">{pageWatchState.title}</div>
            <div className="episode-sub-detail">
              Episode {episode} {"- "}
              {mode === "Eng"
                ? "English Subbed"
                : mode === "vie"
                ? "Vietnamese Subbed"
                : "English Dubbed"}
            </div>
          </h1>
        )}
      <div className="wrapper-player-video">
        <div className="wrapper-discuss-section">
          <h1>CHAT</h1>
          <Chat groupId={malId} user={user} />
        </div>
        <VideoPlayerSection currentEpisode={currentEpisode} user={user} />
      </div>
      <div className="next-previous-episode-container">
        {episodeIndex - 1 > -1 && (
          <div
            className="previous-episode"
            onClick={() => {
              history.push(
                `/anime/${malId}/watch/${
                  episodes[episodeIndex - 1].episode
                }/${mode}`
              );
            }}
          >
            <i className="fas fa-chevron-left"></i>
            <i className="fas fa-chevron-left"></i> Watch episode{" "}
            {episodes[episodeIndex - 1].episode}
          </div>
        )}
        {mode === "Eng" &&
          pageWatchState.episodes &&
          pageWatchState.episodes.episodesEng &&
          episodeIndex + 1 < pageWatchState.episodes.episodesEng.length && (
            <div
              className="next-episode"
              onClick={() => {
                history.push(
                  `/anime/${malId}/watch/${
                    episodes[episodeIndex + 1].episode
                  }/${mode}`
                );
              }}
            >
              Watch episode {episodes[episodeIndex + 1].episode}{" "}
              <i className="fas fa-chevron-right"></i>
              <i className="fas fa-chevron-right"></i>
            </div>
          )}
        {mode === "vie" &&
          pageWatchState.episodes &&
          pageWatchState.episodes.episodes &&
          episodeIndex + 1 < pageWatchState.episodes.episodes.length && (
            <div
              className="next-episode"
              onClick={() => {
                history.push(
                  `/anime/${malId}/watch/${
                    episodes[episodeIndex + 1].episode
                  }/${mode}`
                );
              }}
            >
              Watch episode {episodes[episodeIndex + 1].episode}{" "}
              <i className="fas fa-chevron-right"></i>
              <i className="fas fa-chevron-right"></i>
            </div>
          )}
        {mode === "EngDub" &&
          pageWatchState.episodes &&
          pageWatchState.episodes.episodesEngDub &&
          episodeIndex + 1 < pageWatchState.episodes.episodesEngDub.length && (
            <div
              className="next-episode"
              onClick={() => {
                history.push(
                  `/anime/${malId}/watch/${
                    episodes[episodeIndex + 1].episode
                  }/${mode}`
                );
              }}
            >
              Watch episode {episodes[episodeIndex + 1].episode}{" "}
              <i className="fas fa-chevron-right"></i>
              <i className="fas fa-chevron-right"></i>
            </div>
          )}
      </div>
      <div className="section-episodes-display">
        {pageWatchState.episodes &&
          pageWatchState.episodes.episodes &&
          pageWatchState.episodes.episodes.length > 0 && (
            <div
              className="container-episode-display"
              style={{ maxHeight: isDisplayVietSub ? "100%" : "100px" }}
            >
              <h1
                className={`title${isDisplayVietSub ? " title-active" : ""}`}
                onClick={() => setIsDisplayVietSub(!isDisplayVietSub)}
              >
                Vietsub
              </h1>
              <ListEpisodeUrlDisplay
                episodes={
                  mode === "vie" ? episodes : pageWatchState.episodes.episodes
                }
                episode={episode}
                malId={malId}
                mode={mode}
                modeDisplay={"vie"}
              />
            </div>
          )}
        {pageWatchState.episodes &&
          pageWatchState.episodes.episodesEng &&
          pageWatchState.episodes.episodesEng.length > 0 && (
            <div
              className="container-episode-display"
              style={{ maxHeight: isDisplayEngSub ? "100%" : "100px" }}
            >
              <h1
                className={`title${isDisplayEngSub ? " title-active" : ""}`}
                onClick={() => setIsDisplayEngSub(!isDisplayEngSub)}
              >
                Engsub
              </h1>
              <ListEpisodeUrlDisplay
                episodes={
                  mode === "Eng"
                    ? episodes
                    : pageWatchState.episodes.episodesEng
                }
                episode={episode}
                malId={malId}
                mode={mode}
                modeDisplay={"Eng"}
              />
            </div>
          )}
        {pageWatchState.episodes &&
          pageWatchState.episodes.episodesEngDub &&
          pageWatchState.episodes.episodesEngDub.length > 0 && (
            <div
              className="container-episode-display"
              style={{ maxHeight: isDisplayEngDub ? "100%" : "100px" }}
            >
              <h1
                className={`title${isDisplayEngDub ? " title-active" : ""}`}
                onClick={() => setIsDisplayEngDub(!isDisplayEngDub)}
              >
                Engdub
              </h1>
              <ListEpisodeUrlDisplay
                episodes={
                  mode === "EngDub"
                    ? episodes
                    : pageWatchState.episodes.episodesEngDub
                }
                episode={episode}
                malId={malId}
                mode={mode}
                modeDisplay={"EngDub"}
              />
            </div>
          )}
      </div>
      <Comment malId={malId} user={user} />
    </div>
  );
};
function ListEpisodeUrlDisplay({
  episodes,
  episode,
  malId,
  mode,
  modeDisplay,
}) {
  return (
    <div className="list-episode-movie">
      {episodes &&
        episodes.map((ep, index) => {
          return (
            <Link
              className={`episode-link-movie${
                ep.episode == episode && mode === modeDisplay
                  ? " active-episode"
                  : ""
              }`}
              to={`/anime/${malId}/watch/${ep.episode}/${modeDisplay}`}
              key={index}
            >
              {ep.episode}
            </Link>
          );
        })}
    </div>
  );
}

function fetchTitle$(malId) {
  return ajax("https://api.jikan.moe/v3/anime/" + malId).pipe(
    retry(10),
    pluck("response"),
    catchError((error) => of({ error }))
  );
}
export default EpisodePage;
