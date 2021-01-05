import "./TopAnimeList.css";

import loadable from "@loadable/component";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useState } from "react";

import { topAnimeListStream } from "../../epics/topAnimeList";
import {
  useFetchTopAnime,
  useInitTopAnimeList,
  usePageScrollingUpdatePage,
} from "../../Hook/topAnimeList";

const TopAnimeItem = loadable(() => import("../TopAnimeItem/TopAnimeItem"));

function TopAnimeList() {
  const [topAnimeListState, setTopAnimeListState] = useState(
    topAnimeListStream.currentState()
  );
  useInitTopAnimeList(setTopAnimeListState);
  usePageScrollingUpdatePage(topAnimeListState);
  useFetchTopAnime(topAnimeListState);
  return (
    <div
      className="top-anime-list-container"
      onScroll={(e) => {
        const containerHeaderTopAnime = document.querySelector(
          ".container-header-top-anime"
        );
        if (e.target.scrollTop === 0) {
          containerHeaderTopAnime.style.boxShadow = "none";
        } else {
          containerHeaderTopAnime.style.boxShadow = "0 0 10px 1px black";
        }
      }}
    >
      <div className="container-header-top-anime">
        <h1>Top Anime</h1>
        <select
          defaultValue={topAnimeListState.toggleFetchMode}
          className="select-top-anime"
          onChange={(e) => {
            document
              .querySelector(".top-anime-list-container")
              .scroll({ top: 0 });
            topAnimeListStream.updateData({
              toggleFetchMode: e.target.value,
              pageTopMovieOnDestroy: null,
              isStopFetchTopMovie: false,
              pageSplitTopMovie: 1,
              allowFetchIncreasePageTopMovie: false,
              pageTopMovie: 1,
              dataTopMovie: [],
            });
          }}
        >
          <option value="">Score</option>
          <option value="/bypopularity">Popularity</option>
          <option value="/tv">Tv</option>
          <option value="/movie">Movie</option>
          <option value="/ova">Ova</option>
          <option value="/special">Special</option>
          <option value="/favorite">Favorite</option>
        </select>{" "}
      </div>
      <ul className="top-anime-list">
        {topAnimeListState.dataTopMovie
          .slice(0, 8 + (topAnimeListState.pageSplitTopMovie - 1) * 8)
          .map((movie, index) => (
            <TopAnimeItem
              movie={movie}
              key={index}
              lazy={topAnimeListState.pageSplitTopMovie === 1}
            />
          ))}
        <div
          style={{
            display: topAnimeListState.isStopFetchTopMovie ? "none" : "block",
            height: "70px",
            width: "100%",
          }}
        >
          <CircularProgress color="secondary" />
        </div>
        {topAnimeListState.isStopFetchTopMovie && <h1>End</h1>}
      </ul>
    </div>
  );
}

export default TopAnimeList;
