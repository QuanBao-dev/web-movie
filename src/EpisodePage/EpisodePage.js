import "./EpisodePage.css";

import React, { useEffect, useState } from "react";

import Comment from "../components/Comment/Comment";
import { fetchEpisodesOfMovie$, pageWatchStream } from "../epics/pageWatch";
import { allowShouldFetchEpisodeMovie } from "../store/pageWatch";
import { Link } from "react-router-dom";
import { allowShouldFetchComment } from "../store/comment";
import { userStream } from "../epics/user";
import Chat from "../components/Chat/Chat";
import { theaterStream } from "../epics/theater";
const EpisodePage = (props) => {
  const { malId, episode } = props.match.params;
  const [pageWatchState, setPageWatchState] = useState(
    pageWatchStream.initialState
  );
  const user = userStream.currentState();
  useEffect(() => {
    const subscription = pageWatchStream.subscribe(setPageWatchState);
    pageWatchStream.init();
    let fetchEpisodesSub;
    if (pageWatchState.shouldFetchEpisodeMovie) {
      if (user)
        theaterStream.socket.emit("user-join-watch", malId, user.username);
      fetchEpisodesSub = fetchEpisodesOfMovie$(malId).subscribe((v) => {
        pageWatchStream.updateEpisodes(v);
        const e = document.getElementsByClassName("active-episode").item(0);
        e.scrollIntoView();
        allowShouldFetchEpisodeMovie(false);
      });
    }
    return () => {
      subscription.unsubscribe();
      fetchEpisodesSub && fetchEpisodesSub.unsubscribe();
    };
  }, [malId, pageWatchState.shouldFetchEpisodeMovie, user]);
  let currentEpisode = {};
  const { episodes } = pageWatchState;
  if (episodes)
    currentEpisode = episodes.find((ep) => {
      return ep.episode === parseInt(episode);
    });

  // console.log(currentEpisode);
  return (
    <div className="container-episode-movie">
      <div className="wrapper-discuss-section">
        <h1>Q&A</h1>
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
                <button
                  className="btn btn-primary"
                  style={{ backgroundColor: "black" }}
                  onClick={() => {
                    document.addEventListener("copy", (e) => {
                      copyToClipboard(e, currentEpisode);
                    });
                    document.execCommand("copy");
                  }}
                >
                  Copy Video Url for theater
                </button>
              )}
              <video
                className="video-player"
                width="100%"
                height="100%"
                src={currentEpisode.embedUrl}
                controls={true}
              ></video>
            </div>
          )}
        </div>
        <div className="section-episodes-display">
          <h1>All Episodes</h1>
          <div className="list-episode-movie">
            {episodes &&
              episodes.map((ep, index) => {
                return (
                  <Link
                    className={`episode-link-movie${
                      ep.episode === parseInt(episode) ? " active-episode" : ""
                    }`}
                    to={`/anime/${malId}/watch/${ep.episode}`}
                    key={index}
                    onClick={() => allowShouldFetchComment(true)}
                  >
                    {ep.episode}
                  </Link>
                );
              })}
          </div>
        </div>
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
