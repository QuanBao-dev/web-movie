import "./SearchedAnimeList.css";

import loadable from "@loadable/component";
import React from "react";
import { useEffect } from "react";
import { useRef } from "react";

const SearchedAnime = loadable(() => import("../SearchedAnime/SearchedAnime"));

const SearchedAnimeList = ({ textSearch, dataSearch }) => {
  const searchListAnimeRef = useRef();
  useEffect(() => {
    if (searchListAnimeRef.current.scroll)
      searchListAnimeRef.current.scroll({
        left: 0,
      });
  }, [textSearch]);
  return (
    <>
      {dataSearch && dataSearch.length !== 0 && (
        <h3 style={{ color: "white", textAlign: "center" }}>
          {dataSearch.length} results
        </h3>
      )}
      {textSearch && dataSearch.length === 0 && (
        <h3 style={{ color: "white", textAlign: "center" }}>0 results</h3>
      )}
      <div
        className="search-list-anime"
        ref={searchListAnimeRef}
        style={{
          display: dataSearch && dataSearch.length > 0 ? "block" : "none",
        }}
      >
        {dataSearch.length > 0 &&
          dataSearch.map((anime, index) => {
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
