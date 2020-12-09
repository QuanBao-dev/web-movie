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
    <div className="top-anime-list-container">
      <h1>Top Anime</h1>
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
