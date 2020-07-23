import React from "react";
import "./SearchedAnime.css";
import { useHistory } from "react-router-dom";

const SearchedAnime = ({ image_url, title }) => {
  const history = useHistory();
  return (
    <div className="search-item-anime" onClick={() => {history.push("/anime/"+ title)}}>
      <img src={image_url} alt="Preview" />
      <div className="anime-info">
        <h3>{title}</h3>
      </div>
    </div>
  );
};

export default SearchedAnime;
