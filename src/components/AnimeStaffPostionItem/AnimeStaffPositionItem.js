import './AnimeStaffPositionItem.css';

import React from 'react';

function AnimeStaffPositionItem({ updateStaffPosition, keyData, history }) {
  return (
    <div
      className={
        updateStaffPosition[keyData].positions.includes(
          "Theme Song Performance"
        )
          ? "anime-theme-song-performance-role"
          : ""
      }
      onClick={() =>
        history.push("/anime/" + updateStaffPosition[keyData].mal_id)
      }
    >
      <img src={updateStaffPosition[keyData].image_url} alt="image_anime" />
      <div className="pop-up-hover">
        <h3 title="name">{updateStaffPosition[keyData].name}</h3>
        {updateStaffPosition[keyData].positions.map((theme, index) => (
          <span title="role" key={index}>
            ( {theme} )
          </span>
        ))}
      </div>
    </div>
  );
}

export default AnimeStaffPositionItem;
