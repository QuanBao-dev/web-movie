import './SearchedAnime.css';

import React from 'react';
import { useHistory } from 'react-router-dom';
import { LazyLoadImage } from "react-lazy-load-image-component";

const SearchedAnime = ({ image_url, malId, title }) => {
  const history = useHistory();
  return (
    <div className="search-item-anime" onClick={() => {history.push("/anime/"+ malId)}}>
      <LazyLoadImage src={image_url} alt="Preview" />
      <div className="anime-info">
        <h3>{title}</h3>
      </div>
    </div>
  );
};

export default SearchedAnime;
