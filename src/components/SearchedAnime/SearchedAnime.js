import "./SearchedAnime.css";

import "react-lazy-load-image-component/src/effects/opacity.css";
import React from "react";

import { useHistory } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { nameStream } from "../../epics/name";

const SearchedAnime = ({ image_url, malId, title }) => {
  const history = useHistory();
  return (
    <div
      className="search-item-anime"
      onClick={() => {
        history.push("/anime/" + malId);
        nameStream.resetState();
      }}
    >
      <LazyLoadImage src={image_url} alt="Preview" effect="opacity" />
      <div className="anime-info">
        <h3>{title}</h3>
      </div>
    </div>
  );
};

export default SearchedAnime;
