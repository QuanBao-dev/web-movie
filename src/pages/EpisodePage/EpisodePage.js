/* eslint-disable eqeqeq */
import './EpisodePage.css';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Chat from '../../components/Chat/Chat';
import Comment from '../../components/Comment/Comment';
import { fetchEpisodesOfMovie$, pageWatchStream } from '../../epics/pageWatch';
import { userStream } from '../../epics/user';
import { allowShouldFetchComment } from '../../store/comment';
import { theaterStream } from '../../epics/theater';

const EpisodePage = (props) => {
  const { malId, episode, mode } = props.match.params;
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
      const e = document.getElementsByClassName("active-episode").item(0);
      if (e) {
        e.scrollIntoView();
      }
    });
    return () => {
      subscription.unsubscribe();
      fetchEpisodesSub && fetchEpisodesSub.unsubscribe();
      pageWatchStream.updateEpisodes([]);
    };
  }, [malId, pageWatchState.shouldFetchEpisodeMovie, user]);
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
      <div className="wrapper-player-video">
        <div className="wrapper-discuss-section">
          <h1>DISCUSS</h1>
          <Chat groupId={malId} user={user} />
        </div>
        <div className="video-player-container">
          <div
            className="section-play-movie"
            style={{
              paddingBottom:
                currentEpisode && !currentEpisode.typeVideo ? "70%" : "0",
            }}
          >
            {currentEpisode && !currentEpisode.typeVideo && (
              <iframe
                className="embed-video-player"
                width="100%"
                height="100%"
                src={currentEpisode.embedUrl}
                title={currentEpisode.episode}
                allowFullScreen
              />
            )}
            {currentEpisode && currentEpisode.typeVideo && (
              <div className="video-container__episode">
                {user && (
                  <div className="container-copy">
                    <button
                      className="btn btn-primary"
                      style={{ backgroundColor: "black" }}
                      onClick={() => {
                        document.querySelector(
                          ".result-success"
                        ).style.display = "inline-block";
                        document.addEventListener("copy", (e) => {
                          copyToClipboard(e, currentEpisode);
                        });
                        document.execCommand("copy");
                      }}
                    >
                      Copy Video Url for theater
                    </button>
                    <div className="result-success">
                      <img
                        src="https://thumbs.gfycat.com/ShyCautiousAfricanpiedkingfisher-size_restricted.gif"
                        alt="check_success"
                      />
                      <span>Ok</span>
                    </div>
                  </div>
                )}
                <video
                  className="video-player"
                  width="100%"
                  height="100%"
                  src={currentEpisode.embedUrl}
                  controls={true}
                  playsInline
                ></video>
              </div>
            )}
          </div>
        </div>
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
      <Comment malId={malId} user={user} />
    </div>
  );
};
const copyToClipboard = (event, currentEpisode) => {
  event.clipboardData.setData("text", currentEpisode.embedUrl);
  event.preventDefault();
};
export default EpisodePage;
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
