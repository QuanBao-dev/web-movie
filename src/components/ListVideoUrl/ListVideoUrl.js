import React from "react";
import { Link } from "react-router-dom";
function ListVideoUrl({ episodeData, malId, keyListEpisode }) {
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
                to={`/anime/${malId}/watch/${episode.episode}/${
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
export default ListVideoUrl