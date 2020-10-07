import "./SearchedAnimeList.css";

import React, { Suspense } from "react";

const SearchedAnime = React.lazy(() =>
  import("../SearchedAnime/SearchedAnime")
);

const SearchedAnimeList = ({ homeState }) => {
  if (homeState.textSearch && homeState.dataFilter.length === 0) {
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
              <Suspense
                key={index}
                fallback={<i className="fas fa-spinner fa-9x fa-spin"></i>}
              >
                <SearchedAnime
                  image_url={anime.image_url}
                  malId={anime.mal_id}
                  title={anime.title}
                />
              </Suspense>
            );
          })}
      </div>
    </>
  );
};

export default SearchedAnimeList;
