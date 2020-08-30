import React, { useEffect } from "react";
import "./AnimeItem.css";
import { useHistory } from "react-router-dom";
// import { timer } from "rxjs";
const AnimeItem = ({ anime, imageRef }) => {
  const history = useHistory();
  useEffect(() => {
    imageRef.current.src = anime.imageUrl || anime.image_url;
  }, [anime.imageUrl, anime.image_url, imageRef]);
  return (
    <div
      className="anime-item"
      onClick={() => history.push(`/anime/${anime.malId || anime.mal_id}`)}
    >
      {anime.airing_start &&
        new Date(anime.airing_start).getTime() <=
          new Date(Date.now() - 2592000000).getTime() && (
          <div className="anime-airing-symbol">Airing</div>
        )}
      <img
        style={{
          objectFit: "contain",
          position: "absolute",
        }}
        src={anime.imageUrl || anime.image_url}
        alt="NOT_FOUND"
        ref={imageRef}
      />
      <div className="anime-item-info">
        <h3>{anime.title}</h3>
        {anime.updatedAt && (
          <h3>At: {new Date(anime.updatedAt).toUTCString()}</h3>
        )}
        {anime.airing_start && (
          <h3>{new Date(anime.airing_start).toUTCString()}</h3>
        )}
      </div>
    </div>
  );
};

export default AnimeItem;
