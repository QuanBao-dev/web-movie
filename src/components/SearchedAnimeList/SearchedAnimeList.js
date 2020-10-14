import "./SearchedAnimeList.css";

import loadable from "@loadable/component";
import React from "react";
import { useEffect } from "react";
import { useRef } from "react";

const SearchedAnime = loadable(() => import("../SearchedAnime/SearchedAnime"));

const SearchedAnimeList = ({ homeState }) => {
  const searchListAnimeRef = useRef();
  if (homeState.textSearch && homeState.dataFilter.length === 0) {
    homeState.textSearch = "";
  }
  useEffect(() => {
    searchListAnimeRef.current.scroll(0,0);
  },[homeState.textSearch]);
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
        ref={searchListAnimeRef}
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
