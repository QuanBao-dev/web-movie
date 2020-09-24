/* eslint-disable react-hooks/exhaustive-deps */
import "./GenreDetail.css";

import React, { useEffect, useState } from "react";
import { fromEvent, of, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  debounceTime,
  exhaustMap,
  filter,
  first,
  pluck,
  retry,
  tap,
} from "rxjs/operators";

import AnimeList from "../AnimeList/AnimeList";
import { stream } from "../../epics/home";
import { updatePageOnDestroy } from "../../store/home";

const GenreDetail = (props) => {
  const { genreId, genre } = props.match.params;
  const [homeState, setHomeState] = useState(
    stream.currentState() ? stream.currentState() : stream.initialState
  );
  useEffect(() => {
    const subscription = stream.subscribe(setHomeState);
    return () => {
      subscription.unsubscribe();
      updatePageOnDestroy(stream.currentState().pageGenre);
    };
  }, []);
  useEffect(() => {
    const subscription1 = updatePageScrollingWindow$().subscribe((v) => {
      const currentPage = homeState.pageGenre;
      stream.updatePageGenre(currentPage + 1);
    });
    let subscription;
    console.log(homeState.pageGenre, stream.currentState().pageOnDestroy);
    if (homeState.pageGenre !== stream.currentState().pageOnDestroy)
      subscription = fetchDataGenreAnimeList(
        genreId,
        homeState.pageGenre,
        subscription1
      ).subscribe((v) => {
        const updatedAnime = [...homeState.genreDetailData, ...v];
        stream.updateGenreDetailData(updatedAnime);
      });
    return () => {
      subscription && subscription.unsubscribe();
      subscription1.unsubscribe();
    };
  }, [homeState.pageGenre]);
  return (
    <div className="container-genre-detail">
      <h1>{genre} anime</h1>
      <AnimeList data={homeState.genreDetailData} error={null} />
      <div className="loading-symbol">
        <i className="fas fa-spinner fa-3x fa-spin"></i>
      </div>
    </div>
  );
};

function fetchDataGenreAnimeList(genreId, page, subscription1) {
  return timer(0).pipe(
    tap(
      () => (document.querySelector(".loading-symbol").style.display = "block")
    ),
    exhaustMap(() =>
      ajax(`https://api.jikan.moe/v3/genre/anime/${genreId}/${page}`).pipe(
        retry(5),
        pluck("response", "anime"),
        tap(
          () =>
            (document.querySelector(".loading-symbol").style.display = "none")
        ),
        catchError(() => {
          document.querySelector(".loading-symbol").style.display = "none";
          const h1 = document.createElement("h1");
          h1.innerText = "End";
          h1.style.marginBottom = "0";
          document.querySelector(
            ".container-genre-detail"
          ).style.paddingBottom = "0";
          document.querySelector(".container-genre-detail").appendChild(h1);
          subscription1 && subscription1.unsubscribe();
          return of([]);
        })
      )
    )
  );
}

function updatePageScrollingWindow$() {
  return fromEvent(window, "scroll").pipe(
    debounceTime(500),
    filter(() => document.body.scrollHeight - (window.scrollY + 2000) < 0)
  );
}

export default GenreDetail;
