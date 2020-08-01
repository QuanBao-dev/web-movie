/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import { orderBy } from "lodash";
import { combineLatest, fromEvent, of, timer, from } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  debounceTime,
  filter,
  map,
  pluck,
  share,
  switchMap,
  switchMapTo,
  tap,
  mergeMap,
  combineAll
} from "rxjs/operators";

import todoStore, {
  savingTextSearch,
  updateIsLoading,
  updateMaxPage,
  updateOriginalData,
  updateTopMovie,
} from "../store/todo";

export const stream = todoStore;

export const validateFormSubmit$ = (
  emailUsername,
  inputPassword,
  buttonSubmit
) => {
  buttonSubmit.disabled = true;
  const username$ = fromEvent(emailUsername, "input");
  const password$ = fromEvent(inputPassword, "input");
  const source$ = from([username$, password$]).pipe(combineAll());
  return source$.pipe(
    map(([email, password]) => {
      if (
        email.target.value.length < 6 ||
        !email.target.value.includes("@") ||
        password.target.value.length < 6
      ) {
        buttonSubmit.disabled = true;
      } else {
        buttonSubmit.disabled = false;
      }
      return [email.target.value, password.target.value];
    })
  );
};

export const fetchAnimeSeason$ = (year, season, page, numberOfProducts) => {
  return timer(0).pipe(
    tap(() => updateIsLoading(true)),
    switchMapTo(
      ajax(`https://api.jikan.moe/v3/season/${year}/${season}`).pipe(
        share(),
        pluck("response", "anime"),
        map((anime) => {
          updateMaxPage(Math.ceil(anime.length / 12));
          updateOriginalData(anime);
          updateIsLoading(false);
          stream.catchingError(null);
          return orderBy(anime, ["airing_start"], ["desc"]).slice(
            (page - 1) * numberOfProducts,
            page * numberOfProducts
          );
        }),
        catchError((error) => {
          console.error(error);
          updateIsLoading(false);
          stream.catchingError(error);
          return of([]);
        })
      )
    ),
    tap((v) => {
      stream.updateAnimeData(v);
      updateIsLoading(false);
    })
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

export const fetchTopMovie$ = () => {
  return timer(0).pipe(
    switchMapTo(
      ajax({
        url: "http://api.jikan.moe/v3/top/anime/1/airing",
      }).pipe(
        share(),
        pluck("response", "top"),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
    ),
    tap((topMovieList) => stream.updateTopMovie(topMovieList))
  );
};

export const fetchAnimeSchedule$ = (weekIndex) => {
  const week = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const filterWeek = week.filter((v, index) => weekIndex[index]);
  const source$ = from(filterWeek);
  return source$.pipe(
    mergeMap((day) =>
      ajax(`https://api.jikan.moe/v3/schedule/${day}`).pipe(
        pluck("response", day),
        catchError((err) => {
          console.error(err);
          return of([]);
        }),
        tap((v) => stream.updateDataSchedule({ [day]: v }))
      )
    )
  );
};
