import "./TopAnimeList.css";

import React, { useEffect } from "react";

import {
  fetchTopMovie$,
  stream,
  topMovieUpdatedScrolling$,
} from "../../epics/home";
import { updatePageTopMovieOnDestroy } from "../../store/home";
import loadable from "@loadable/component";
import CircularProgress from "@material-ui/core/CircularProgress";

const TopAnimeItem = loadable(() => import("../TopAnimeItem/TopAnimeItem"));

function TopAnimeList({ homeState = stream.initialState }) {
  useEffect(() => {
    if (stream.currentState().screenWidth > 697) {
      setTimeout(() => {
        if (document.querySelector(".top-anime-list-container"))
          document.querySelector(".top-anime-list-container").scroll({
            top: stream.currentState().positionScrollTop,
          });
      }, 400);
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
          if (
            8 + (stream.currentState().pageSplitTopMovie - 1) * 8 >
            stream.currentState().dataTopMovie.length
          )
            updateDataTopScrolling();
        }
      );
      if (stream.currentState().isStopFetchTopMovie) {
        subscription11 && subscription11.unsubscribe();
      }
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
        {homeState.dataTopMovie
          .slice(0, 8 + (homeState.pageSplitTopMovie - 1) * 8)
          .map((movie, index) => (
            <TopAnimeItem
              movie={movie}
              key={index}
              lazy={homeState.pageSplitTopMovie === 1}
            />
          ))}
        <div
          style={{
            display: homeState.isStopFetchTopMovie ? "none" : "block",
            height: "70px",
            width:"100%"
          }}
        >
          <CircularProgress color="secondary" />
        </div>
        {homeState.isStopFetchTopMovie && <h1>End</h1>}
      </ul>
    </div>
  );
}

function updateDataTopScrolling() {
  stream.updatePageTopMovie(stream.currentState().dataTopMovie.length / 50 + 1);
}

export default TopAnimeList;
