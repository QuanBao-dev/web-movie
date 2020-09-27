/* eslint-disable react-hooks/exhaustive-deps */
import "./GenreDetail.css";

import React, { useEffect, useState } from "react";
import { fromEvent, of, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  debounceTime,
  filter,
  mergeMap,
  pluck,
  retry,
  tap,
} from "rxjs/operators";

import { stream } from "../../epics/home";
import { updatePageOnDestroy } from "../../store/home";
import AnimeList from "../../components/AnimeList/AnimeList";

const GenreDetail = (props) => {
  const { genreId } = props.match.params;
  const [homeState, setHomeState] = useState(stream.initialState);
  const [name, setName] = useState("");
  useEffect(() => {
    const subscription = stream.subscribe(setHomeState);
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (genreId !== stream.currentState().currentGenreId) {
      updatePageOnDestroy(null);
      stream.updateIsStopScrollingUpdated(false);
    }
  }, [homeState.currentGenreId]);
  useEffect(() => {
    let subscription1;
    if (homeState.allowFetchIncreaseGenrePage) {
      subscription1 = updatePageScrollingWindow$().subscribe((v) => {
        stream.updatePageGenre(homeState.genreDetailData.length / 100 + 1);
      });
    }
    return () => {
      subscription1 && subscription1.unsubscribe();
    };
  }, [homeState.allowFetchIncreaseGenrePage, homeState.pageGenre]);
  useEffect(() => {
    let subscription;
    console.log(homeState.pageGenre, stream.currentState().pageOnDestroy);
    if (
      homeState.pageGenre !== stream.currentState().pageOnDestroy &&
      homeState.isStopScrollingUpdated === false
    )
      subscription = fetchDataGenreAnimeList(
        genreId,
        homeState.pageGenre
      ).subscribe((v) => {
        if (!v.error) {
          const updatedAnime = [...homeState.genreDetailData, ...v.anime];
          if (v.mal_url) {
            setName(v.mal_url.name);
          }
          stream.updateGenreDetailData(updatedAnime);
          stream.updateCurrentGenreId(genreId);
          updatePageOnDestroy(stream.currentState().pageGenre);
          stream.updateAllowUpdatePageGenre(true);
        } else {
          stream.updateIsStopScrollingUpdated(true);
          stream.updateAllowUpdatePageGenre(false);
        }
      });
    return () => {
      subscription && subscription.unsubscribe();
    };
  }, [homeState.pageGenre]);
  console.log(homeState);
  return (
    <div className="container-genre-detail">
      <h1>{name}</h1>
      <AnimeList data={homeState.genreDetailData} error={null} />
      <div className="loading-symbol">
        <i className="fas fa-spinner fa-3x fa-spin"></i>
      </div>
      {homeState.isStopScrollingUpdated && <h1>End</h1>}
    </div>
  );
};

function fetchDataGenreAnimeList(genreId, page) {
  return timer(0).pipe(
    tap(() => {
      stream.updateAllowUpdatePageGenre(false);
      if (document.querySelector(".loading-symbol").style.display !== "flex")
        document.querySelector(".loading-symbol").style.display = "flex";
      else endFetching();
    }),
    mergeMap(() =>
      ajax(`https://api.jikan.moe/v3/genre/anime/${genreId}/${page}`).pipe(
        retry(5),
        pluck("response"),
        tap(
          () =>
            (document.querySelector(".loading-symbol").style.display = "none")
        ),
        catchError(() => {
          endFetching();
          return of({ error: true });
        })
      )
    )
  );
}

function endFetching() {
  if (document.querySelector(".loading-symbol")) {
    document.querySelector(".loading-symbol").style.display = "none";
  }
}

function updatePageScrollingWindow$() {
  return fromEvent(window, "scroll").pipe(
    debounceTime(1000),
    filter(() => document.body.scrollHeight - (window.scrollY + 2000) < 0)
  );
}

export default GenreDetail;
