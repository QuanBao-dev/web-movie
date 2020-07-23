import React from "react";
import SearchedAnime from "../SearchedAnime/SearchedAnime";
import "./SearchedAnimeList.css";

const SearchedAnimeList = ({ todoState }) => {
  return (
    <div
      className="search-list-anime"
      style={{ display: todoState.dataFilter && todoState.dataFilter.length > 0 ? "block" : "none" }}
    >
      {todoState.dataFilter&&todoState.dataFilter.map((anime, index) => {
        return (
          <SearchedAnime
            key={index}
            image_url={anime.image_url}
            title={anime.title}
          />
        );
      })}
    </div>
  );
};

export default SearchedAnimeList;
