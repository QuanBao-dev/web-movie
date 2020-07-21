/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import { orderBy } from "lodash";
import { combineLatest, fromEvent, of, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  filter,
  map,
  pluck,
  switchMap,
  tap,
  switchMapTo,
  share,
  debounceTime
} from "rxjs/operators";

import todoStore, {
  savingTextSearch,
  updateIsLoading,
  updateMaxPage,
} from "../store/todo";

export const stream = todoStore;

export const validateFormSubmit$ = (inputUsername, inputPassword) => {
  const username$ = fromEvent(inputUsername, "input");
  const password$ = fromEvent(inputPassword, "input");
  return combineLatest(username$, password$).pipe(
    map(([username, password]) => {
      return [username.target.value, password.target.value];
    })
  );
};

export const fetchAnimeSeason$ = (year, season, page, numberOfProducts) => {
  return timer(0).pipe(
    switchMapTo(
      ajax(`https://api.jikan.moe/v3/season/${year}/${season}`).pipe(
        tap(() => updateIsLoading(true)),
        share(),
        pluck("response", "anime"),
        map((anime) => {
          updateMaxPage(Math.ceil(anime.length / 12));
          return orderBy(anime, ["airing_start"], ["desc"]).slice(
            (page - 1) * numberOfProducts,
            page * numberOfProducts
          );
        }),
        tap((v) => {
          stream.updateAnimeData(v);
          updateIsLoading(false);
        }),
        catchError((error) => {
          stream.handleError(error);
          return of([]);
        })
      )
    )
  );
};

export const changeCurrentPage$ = () => {
  return fromEvent(document, "keydown").pipe(
    filter((v) => v.target.tagName === "BODY"),
    pluck("keyCode"),
    map((keyCode) => {
      switch (keyCode) {
        case 39:
          stream.increaseCurrentPage();
          return;
        case 37:
          stream.decreaseCurrentPage();
          return;
        default:
          return;
      }
    })
  );
};

export const changeYear$ = (selectYearElement) => {
  const year$ = fromEvent(selectYearElement, "change");
  return year$.pipe(
    pluck("target", "value"),
    tap((year) => {
      stream.updateYear(parseInt(year));
    }),
    catchError((err) => {
      console.error(err);
      return of("");
    })
  );
};

export const changeSeason$ = (selectSeasonElement) => {
  const year$ = fromEvent(selectSeasonElement, "change");
  return year$.pipe(
    pluck("target", "value"),
    tap((season) => {
      stream.updateSeason(season);
    }),
    catchError((err) => {
      console.error(err);
      return of("");
    })
  );
};

export const changeSearchInput$ = (searchInputElement) => {
  const searchedInput$ = fromEvent(searchInputElement, "input").pipe(
    debounceTime(1000)
  );
  return searchedInput$.pipe(
    pluck("target", "value"),
    tap((text) => savingTextSearch(text)),
    catchError((err) => {
      console.error(err);
      return of("");
    }),
    switchMap((text) =>
      ajax("https://api.jikan.moe/v3/search/anime?q=" + text).pipe(
        share(),
        pluck("response", "results"),
        map((data) => {
          const dataSearched = data;
          return dataSearched;
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
    ),
    tap((data) => stream.updateDataFilter(data))
  );
};
