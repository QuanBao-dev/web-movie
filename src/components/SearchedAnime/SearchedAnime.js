import './SearchedAnime.css';

import React from 'react';
import { useHistory } from 'react-router-dom';

const SearchedAnime = ({ image_url, malId, title }) => {
  const history = useHistory();
  return (
    <div className="search-item-anime" onClick={() => {history.push("/anime/"+ malId)}}>
      <img src={image_url} alt="Preview" />
      <div className="anime-info">
        <h3>{title}</h3>
      </div>
    </div>
  );
};

export default SearchedAnime;
