import "./SearchedAnimeList.css";

import React from "react";

import SearchedAnime from "../SearchedAnime/SearchedAnime";

const SearchedAnimeList = ({ homeState }) => {
  homeState.dataFilter = homeState.dataFilter.filter((data) => {
    return !["Rx"].includes(data.rated);
  });
  if(homeState.textSearch && homeState.dataFilter.length === 0){
    homeState.textSearch = "";
  }
  return (
    <>
      {homeState.dataFilter && homeState.dataFilter.length !== 0 && (
        <h3 style={{ color: "white" }}>
          {homeState.dataFilter.length} results
        </h3>
      )}
      {homeState.textSearch && homeState.dataFilter.length === 0 && (
        <h3 style={{ color: "white" }}>0 results</h3>
      )}
      <div
        className="search-list-anime"
        style={{
          display:
            homeState.dataFilter && homeState.dataFilter.length > 0
              ? "block"
              : "none",
        }}
      >
        {homeState.dataFilter.length > 0 &&
          homeState.dataFilter.map((anime, index) => {
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
    </>
  );
};

export default SearchedAnimeList;
