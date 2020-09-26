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
      updatePageOnDestroy(stream.currentState().pageGenre);
    };
  }, []);
  useEffect(() => {
    let subscription1;
    if (homeState.allowFetchIncreaseGenrePage) {
      subscription1 = updatePageScrollingWindow$().subscribe((v) => {
        const currentPage = homeState.pageGenre;
        stream.updatePageGenre(currentPage + 1);
      });
    }
    return () => {
      subscription1 && subscription1.unsubscribe();
    };
  }, [homeState.allowFetchIncreaseGenrePage, homeState.pageGenre]);
  useEffect(() => {
    let subscription;
    // console.log(homeState.pageGenre, stream.currentState().pageOnDestroy);
    if (homeState.pageGenre !== stream.currentState().pageOnDestroy)
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
          stream.updateAllowUpdatePageGenre(true);
        } else {
          stream.updateAllowUpdatePageGenre(false);
        }
      });
    return () => {
      subscription && subscription.unsubscribe();
    };
  }, [homeState.pageGenre]);
  // console.log(homeState);
  return (
    <div className="container-genre-detail">
      <h1>{name}</h1>
      <AnimeList data={homeState.genreDetailData} error={null} />
      <div
        className="loading-symbol"
        style={{
          display: homeState.allowFetchIncreaseGenrePage ? "flex" : "none",
        }}
      >
        <i className="fas fa-spinner fa-3x fa-spin"></i>
      </div>
    </div>
  );
};

function fetchDataGenreAnimeList(genreId, page, subscription1) {
  return timer(0).pipe(
    tap(() => {
      stream.updateAllowUpdatePageGenre(false);
      if (document.querySelector(".loading-symbol").style.display !== "block")
        document.querySelector(".loading-symbol").style.display = "block";
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
          subscription1 && subscription1.unsubscribe();
          return of({ error: true });
        })
      )
    )
  );
}

function endFetching() {
  if (document.querySelector(".loading-symbol")) {
    document.querySelector(".loading-symbol").style.display = "none";
    const h1 = document.createElement("h1");
    h1.innerText = "End";
    h1.style.marginBottom = "0";
    document.querySelector(".container-genre-detail").style.paddingBottom = "0";
    document.querySelector(".container-genre-detail").appendChild(h1);
  }
}

function updatePageScrollingWindow$() {
  return fromEvent(window, "scroll").pipe(
    debounceTime(1000),
    filter(() => document.body.scrollHeight - (window.scrollY + 2000) < 0)
  );
}

export default GenreDetail;
