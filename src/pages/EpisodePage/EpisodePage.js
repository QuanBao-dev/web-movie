/* eslint-disable eqeqeq */
import "./EpisodePage.css";

import React, { Suspense, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { fetchEpisodesOfMovie$, pageWatchStream } from "../../epics/pageWatch";
import { theaterStream } from "../../epics/theater";
import { userStream } from "../../epics/user";
import { allowShouldFetchComment } from "../../store/comment";

const Comment = React.lazy(() => import("../../components/Comment/Comment"));
const Chat = React.lazy(() => import("../../components/Chat/Chat"));
const VideoPlayerSection = React.lazy(() =>
  import("../../components/VideoPlayerSection/VideoPlayerSection")
);

const EpisodePage = (props) => {
  const { malId, episode, mode } = props.match.params;
  const history = useHistory();
  const [pageWatchState, setPageWatchState] = useState(
    pageWatchStream.initialState
  );
  const user = userStream.currentState();
  useEffect(() => {
    const subscription = pageWatchStream.subscribe(setPageWatchState);
    pageWatchStream.init();
    let fetchEpisodesSub;
    if (user)
      theaterStream.socket.emit("user-join-watch", malId, user.username);
    fetchEpisodesSub = fetchEpisodesOfMovie$(malId).subscribe((v) => {
      pageWatchStream.updateEpisodes(v);
    });
    return () => {
      subscription.unsubscribe();
      fetchEpisodesSub && fetchEpisodesSub.unsubscribe();
      pageWatchStream.updateEpisodes([]);
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
      if (ep.episode[0] === "0") {
        ep.episode = ep.episode.slice(1);
      }
      return ep.episode == episode;
    });
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
      <div className="wrapper-player-video">
        <div className="wrapper-discuss-section">
          <h1>CHAT</h1>
          <Suspense fallback={<h1>Loading...</h1>}>
            <Chat groupId={malId} user={user} />
          </Suspense>
        </div>
        <Suspense
          fallback={
            <div>
              <i className="fas fa-spinner fa-5x fa-spin"></i>
            </div>
          }
        >
          <VideoPlayerSection currentEpisode={currentEpisode} user={user} />
        </Suspense>
      </div>
      <div className="next-previous-episode-container">
        {episode - 1 > 0 && (
          <div
            className="previous-episode"
            onClick={() => {
              history.push(`/anime/${malId}/watch/${episode - 1}/${mode}`);
            }}
          >
            <i className="fas fa-chevron-left"></i>
            <i className="fas fa-chevron-left"></i> Watch episode {episode - 1}
          </div>
        )}
        {mode === "Eng" &&
          pageWatchState.episodes &&
          pageWatchState.episodes.episodesEng &&
          parseInt(episode) + 1 <=
            pageWatchState.episodes.episodesEng.length && (
            <div
              className="next-episode"
              onClick={() => {
                history.push(
                  `/anime/${malId}/watch/${parseInt(episode) + 1}/${mode}`
                );
              }}
            >
              Watch episode {parseInt(episode) + 1}{" "}
              <i className="fas fa-chevron-right"></i>
              <i className="fas fa-chevron-right"></i>
            </div>
          )}
        {mode === "vie" &&
          pageWatchState.episodes &&
          pageWatchState.episodes.episodes &&
          parseInt(episode) + 1 <= pageWatchState.episodes.episodes.length && (
            <div
              className="next-episode"
              onClick={() => {
                history.push(
                  `/anime/${malId}/watch/${parseInt(episode) + 1}/${mode}`
                );
              }}
            >
              Watch episode {parseInt(episode) + 1}{" "}
              <i className="fas fa-chevron-right"></i>
              <i className="fas fa-chevron-right"></i>
            </div>
          )}
        {mode === "EngDub" &&
          pageWatchState.episodes &&
          pageWatchState.episodes.episodesEngDub &&
          parseInt(episode) + 1 <=
            pageWatchState.episodes.episodesEngDub.length && (
            <div
              className="next-episode"
              onClick={() => {
                history.push(
                  `/anime/${malId}/watch/${parseInt(episode) + 1}/${mode}`
                );
              }}
            >
              Watch episode {parseInt(episode) + 1}{" "}
              <i className="fas fa-chevron-right"></i>
              <i className="fas fa-chevron-right"></i>
            </div>
          )}
      </div>
      <div className="section-episodes-display">
        {pageWatchState.episodes &&
          pageWatchState.episodes.episodes &&
          pageWatchState.episodes.episodes.length > 0 && (
            <div>
              <h1 className="title">Vietsub</h1>
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
            <div>
              <h1 className="title">Engsub</h1>
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
            <div>
              <h1 className="title">Engdub</h1>
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
      <Suspense
        fallback={
          <div>
            <i className="fas fa-spinner fa-5x fa-spin"></i>
          </div>
        }
      >
        <Comment malId={malId} user={user} />
      </Suspense>
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
              onClick={() => allowShouldFetchComment(true)}
            >
              {ep.episode}
            </Link>
          );
        })}
    </div>
  );
}

export default EpisodePage;
