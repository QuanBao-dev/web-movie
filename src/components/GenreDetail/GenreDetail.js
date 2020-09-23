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
  pluck,
  retry,
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
    let subscription;
    subscription = updatePageScrollingWindow$().subscribe((v) => {
      const currentPage = homeState.pageGenre;
      stream.updatePageGenre(currentPage + 1);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [homeState.pageGenre]);
  useEffect(() => {
    let subscription;
    console.log(homeState.pageGenre , stream.currentState().pageOnDestroy)
    if (homeState.pageGenre !== stream.currentState().pageOnDestroy)
      subscription = fetchDataGenreAnimeList(
        genreId,
        homeState.pageGenre
      ).subscribe((v) => {
        const updatedAnime = [...homeState.genreDetailData, ...v];
        stream.updateGenreDetailData(updatedAnime);
      });
    return () => {
      subscription && subscription.unsubscribe();
    };
  }, [homeState.pageGenre]);
  return (
    <div className="container-genre-detail">
      <h1>{genre} anime</h1>
      <AnimeList data={homeState.genreDetailData} error={null} />
    </div>
  );
};

function fetchDataGenreAnimeList(genreId, page) {
  return timer(0).pipe(
    exhaustMap(() =>
      ajax(`https://api.jikan.moe/v3/genre/anime/${genreId}/${page}`).pipe(
        retry(5),
        pluck("response", "anime"),
        catchError(() => of([]))
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
