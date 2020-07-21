import React from "react";
import "./SearchedAnime.css";

const SearchedAnime = ({ image_url, title }) => {
  return (
    <div className="search-item-anime">
      <img src={image_url} alt="Preview" />
      <div className="anime-info">
        <h3>{title}</h3>
      </div>
    </div>
  );
};

export default SearchedAnime;
