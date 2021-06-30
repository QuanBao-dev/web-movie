import { fromEvent, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  debounceTime,
  filter,
  map,
  pluck,
  retry,
  switchMap,
  tap,
} from "rxjs/operators";

import searchToolStore from "../store/searchTool";

export const searchToolStream = searchToolStore;

export const changeSearchInput$ = (searchInputElement) => {
  const searchedInput$ = fromEvent(searchInputElement, "input");
  return searchedInput$.pipe(
    debounceTime(300),
    pluck("target", "value"),
    tap((text) => searchToolStream.updateDataQuick({ textSearch: text })),
    retry(20),
    catchError(() => {
      return of("");
    }),
    switchMap((text) =>
      text
        ? ajax("https://api.jikan.moe/v3/search/anime?q=" + text).pipe(
            pluck("response", "results"),
            map((data) => {
              const dataSearched = data;
              return dataSearched;
            }),
            retry(20),
            catchError((error) => {
              return of({ error });
            })
          )
        : of([])
    )
  );
};

export const listenSearchInputPressEnter$ = (searchInputE) => {
  return fromEvent(searchInputE, "keydown").pipe(
    filter((e) => e.keyCode === 13 && e.target.value.trim() !== ""),
    pluck("target", "value")
  );
};
