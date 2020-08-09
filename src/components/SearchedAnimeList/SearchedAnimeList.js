import './SearchedAnimeList.css';

import React from 'react';

import SearchedAnime from '../SearchedAnime/SearchedAnime';

const SearchedAnimeList = ({ homeState }) => {
  return (
    <div
      className="search-list-anime"
      style={{ display: homeState.dataFilter && homeState.dataFilter.length > 0 ? "block" : "none" }}
    >
      {homeState.dataFilter&&homeState.dataFilter.map((anime, index) => {
        return (
          <SearchedAnime
            key={index}
            image_url={anime.image_url}
            malId={anime.mal_id}
            title={anime.title}
          />
        );
      })}
    </div>
  );
};

export default SearchedAnimeList;
