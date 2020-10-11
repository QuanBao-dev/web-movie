import "./TopAnimeList.css";

import React, { Suspense, useEffect } from "react";

import {
  fetchTopMovie$,
  stream,
  topMovieUpdatedScrolling$,
} from "../../epics/home";
import { updatePageTopMovieOnDestroy } from "../../store/home";

const TopAnimeItem = React.lazy(() => import("../TopAnimeItem/TopAnimeItem"));

function TopAnimeList({ homeState = stream.initialState }) {
  useEffect(() => {
    if (stream.currentState().screenWidth > 697) {
      document.querySelector(".top-anime-list-container").scroll({
        top: stream.currentState().positionScrollTop,
      });
    }
    if (stream.currentState().dataTopMovie.length === 0) {
      updatePageTopMovieOnDestroy(null);
      stream.updateIsStopFetchTopMovie(false);
    }
    return () => {
      if (stream.currentState().screenWidth > 697) {
        stream.updatePositionScrollTop(
          document.querySelector(".top-anime-list-container").scrollTop
        );
      }
    };
  }, []);
  useEffect(() => {
    let subscription11;
    const topAnimeElement = document.querySelector(".top-anime-list-container");
    if (topAnimeElement) {
      subscription11 = topMovieUpdatedScrolling$(topAnimeElement).subscribe(
        () => {
          if (homeState.allowFetchIncreasePageTopMovie)
            updateDataTopScrolling();
        }
      );
    }
    return () => {
      subscription11 && subscription11.unsubscribe();
    };
  }, [
    homeState.allowFetchIncreasePageTopMovie,
    homeState.pageTopMovie,
    homeState.screenWidth,
  ]);
  useEffect(() => {
    let subscription7;
    if (
      stream.currentState().pageTopMovieOnDestroy !== homeState.pageTopMovie &&
      !stream.currentState().isStopFetchTopMovie
    )
      subscription7 = fetchTopMovie$().subscribe((topMovieList) => {
        // console.log("fetch top movie");
        const updatedAnime = [
          ...stream.currentState().dataTopMovie,
          ...topMovieList,
        ];
        if (
          updatedAnime.length / 50 + 1 !==
          parseInt(updatedAnime.length / 50 + 1)
        ) {
          stream.updateIsStopFetchTopMovie(true);
        }

        stream.updateTopMovie(updatedAnime);
      });
    return () => {
      subscription7 && subscription7.unsubscribe();
    };
  }, [homeState.pageTopMovie]);
  return (
    <div className="top-anime-list-container">
      <h1>Top Anime</h1>
      <ul className="top-anime-list">
        {homeState.dataTopMovie &&
          stream.currentState().pageSplitTopMovie === 1 &&
          homeState.dataTopMovie
            .slice(0, 9 + (stream.currentState().pageSplitTopMovie - 1) * 5)
            .map((movie, index) => (
              <Suspense
                key={index}
                fallback={
                  <div>
                    <i className="fas fa-spinner fa-9x fa-spin"></i>
                  </div>
                }
              >
                <TopAnimeItem movie={movie} lazy={true} />
              </Suspense>
            ))}
        {homeState.dataTopMovie &&
          stream.currentState().pageSplitTopMovie !== 1 &&
          homeState.dataTopMovie
            .slice(0, 9 + (stream.currentState().pageSplitTopMovie - 1) * 5)
            .map((movie, index) => (
              <Suspense
                key={index}
                fallback={
                  <div>
                    <i className="fas fa-spinner fa-9x fa-spin"></i>
                  </div>
                }
              >
                <TopAnimeItem movie={movie} lazy={false} />
              </Suspense>
            ))}
      </ul>
    </div>
  );
}

function updateDataTopScrolling() {
  stream.updatePageTopMovie(stream.currentState().dataTopMovie.length / 50 + 1);
}

export default TopAnimeList;
