import "./EpisodePage.css";

import React, { useEffect, useState } from "react";

import Comment from "../components/Comment/Comment";
import { fetchEpisodesOfMovie$, pageWatchStream } from "../epics/pageWatch";
import { allowShouldFetchEpisodeMovie } from "../store/pageWatch";
import { Link } from "react-router-dom";
import { allowShouldFetchComment } from "../store/comment";

const EpisodePage = (props) => {
  const { malId, episode } = props.match.params;
  const [pageWatchState, setPageWatchState] = useState(
    pageWatchStream.initialState
  );
  useEffect(() => {
    const subscription = pageWatchStream.subscribe(setPageWatchState);
    pageWatchStream.init();
    let fetchEpisodesSub;
    if (pageWatchState.shouldFetchEpisodeMovie) {
      fetchEpisodesSub = fetchEpisodesOfMovie$(malId).subscribe((v) => {
        pageWatchStream.updateEpisodes(v);
        allowShouldFetchEpisodeMovie(false);
      });
    }
    return () => {
      subscription.unsubscribe();
      fetchEpisodesSub && fetchEpisodesSub.unsubscribe();
    };
  }, [malId, pageWatchState.shouldFetchEpisodeMovie]);
  let currentEpisode = {};
  const { episodes } = pageWatchState;
  if (episodes) {
    currentEpisode = episodes.find((ep) => {
      return ep.episode === parseInt(episode);
    });
  }
  // console.log(currentEpisode);
  return (
    <div className="container-episode-movie">
      <div className="section-play-movie">
        {currentEpisode && (
          <iframe
            width="100%"
            height="500px"
            src={currentEpisode.embedUrl}
            title={currentEpisode.episode}
            allowFullScreen
          />
        )}
        <div className="list-episode-movie">
          {episodes &&
            episodes.map((ep, index) => {
              return (
                <Link
                  className={`episode-link-movie${ep.episode === parseInt(episode) ? " active-episode":""}`}
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
      <Comment malId={malId} />
    </div>
  );
};

export default EpisodePage;