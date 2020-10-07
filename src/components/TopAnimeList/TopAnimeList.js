import "./TopAnimeList.css";

import React, { Suspense, useEffect } from "react";

import {
  fetchTopMovie$,
  stream,
  topMovieUpdatedScrolling$,
} from "../../epics/home";
import { updatePageTopMovieOnDestroy } from "../../store/home";
const TopAnimeItem = React.lazy(() => import("../TopAnimeItem/TopAnimeItem"));

function TopAnimeList({ homeState }) {
  useEffect(() => {
    return () => {
      updatePageTopMovieOnDestroy(stream.currentState().pageTopMovie);
    };
  }, []);
  useEffect(() => {
    let subscription7;
    let subscription11;
    const topAnimeElement = document.querySelector(".top-anime-list-container");
    if (topAnimeElement) {
      subscription11 = topMovieUpdatedScrolling$(topAnimeElement).subscribe(
        () => {
          updateDataTopScrolling();
        }
      );
    }
    if (stream.currentState().pageTopMovieOnDestroy !== homeState.pageTopMovie)
      subscription7 = fetchTopMovie$(subscription11).subscribe(
        (topMovieList) => {
          // console.log("fetch top movie");
          stream.updateTopMovie(topMovieList);
        }
      );
    return () => {
      subscription7 && subscription7.unsubscribe();
      subscription11 && subscription11.unsubscribe();
    };
  }, [homeState.pageTopMovie]);
  return (
    <div className="top-anime-list-container">
      <h1>Top Anime</h1>
      <ul className="top-anime-list">
        {homeState.dataTopMovie &&
          homeState.dataTopMovie.map((movie, index) => (
            <Suspense
              key={index}
              fallback={
                <div>
                  <i className="fas fa-spinner fa-9x fa-spin"></i>
                </div>
              }
            >
              <TopAnimeItem movie={movie} />
            </Suspense>
          ))}
      </ul>
    </div>
  );
}

function updateDataTopScrolling() {
  let page = stream.currentState().pageTopMovie;
  stream.updatePageTopMovie(page + 1);
}

export default TopAnimeList;
