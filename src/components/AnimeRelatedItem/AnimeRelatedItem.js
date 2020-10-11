import './AnimeRelatedItem.css';

import React from 'react';

function AnimeRelatedItem({anime, history}) {
  return (
    <div
      className={anime.role === "Main" ? "anime-main-role" : ""}
      onClick={() => history.push("/anime/" + anime.mal_id)}
    >
      <img src={anime.image_url} alt="image_anime" />
      <div className="pop-up-hover">
        <h3>{anime.name}</h3>
        <div title="role">({anime.role} )</div>
      </div>
    </div>
  );
}
export default AnimeRelatedItem;
