import "./RandomAnimeList.css";

import React, { useEffect, useState } from "react";
import { from, of, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  concatAll,
  pluck,
  retry,
  switchMapTo,
  takeWhile,
} from "rxjs/operators";

import RandomAnimeItem from "../RandomAnimeItem/RandomAnimeItem";
import randomAnimeListStore from "../../store/randomAnimeList";
import { CircularProgress } from "@material-ui/core";

const RandomAnimeList = () => {
  const [randomAnimeListState, setRandomAnimeListState] = useState(
    randomAnimeListStore.currentState()
  );
  useEffect(() => {
    const subscription = randomAnimeListStore.subscribe(
      setRandomAnimeListState
    );
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    const fetchRandomAnime$ = ajax(
      "https://api.jikan.moe/v4/random/anime"
    ).pipe(
      pluck("response", "data"),
      retry(6),
      catchError((error) => of({ error }))
    );
    const subscription = timer(0)
      .pipe(
        takeWhile(() => randomAnimeListState.randomAnimeList.length === 0),
        switchMapTo(
          from([
            fetchRandomAnime$,
            fetchRandomAnime$,
            fetchRandomAnime$,
            fetchRandomAnime$,
            fetchRandomAnime$,
            fetchRandomAnime$,
            fetchRandomAnime$,
          ]).pipe(concatAll())
        )
      )
      .subscribe((randomAnime) => {
        randomAnimeListStore.updateData({
          randomAnimeList: [
            ...randomAnimeListStore.currentState().randomAnimeList,
            randomAnime,
          ],
          isLoading: false,
        });
      });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="random-anime-list">
      {randomAnimeListState.isLoading && (
        <CircularProgress color="secondary" size="5rem" />
      )}
      {randomAnimeListState.randomAnimeList.map(
        (
          { title, duration, aired, episodes, score, rating, images, mal_id },
          index
        ) => (
          <RandomAnimeItem
            key={index}
            title={title}
            aired={aired}
            episodes={episodes}
            score={score}
            images={images}
            malId={mal_id}
            index={index}
          />
        )
      )}
    </div>
  );
};

export default RandomAnimeList;
