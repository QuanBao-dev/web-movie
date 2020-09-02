/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import { orderBy } from "lodash";
import { from, fromEvent, of, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  combineAll,
  debounceTime,
  filter,
  map,
  mergeMap,
  pluck,
  switchMap,
  switchMapTo,
  tap,
} from "rxjs/operators";

import homeStore, {
  allowScrollToSeeMore,
  savingTextSearch,
  updateIsLoading,
  updateMaxPage,
  updateOriginalData,
} from "../store/home";

export const stream = homeStore;

export const validateFormSubmit$ = (
  inputEmail,
  inputPassword,
  inputUsername,
  buttonSubmit
) => {
  buttonSubmit.disabled = true;
  const email$ = fromEvent(inputEmail, "input");
  const password$ = fromEvent(inputPassword, "input");
  const username$ = fromEvent(inputUsername, "input");
  const source$ = from([email$, password$, username$]).pipe(combineAll());
  return source$.pipe(
    map(([email, password, username]) => {
      if (
        email.target.value.length < 6 ||
        !email.target.value.includes("@") ||
        password.target.value.length < 6 ||
        username.target.value.length < 6
      ) {
        buttonSubmit.disabled = true;
      } else {
        buttonSubmit.disabled = false;
      }
      return [email.target.value, password.target.value, username.target.value];
    })
  );
};

export const validateFormSubmitLogin$ = (
  inputEmail,
  inputPassword,
  buttonSubmit
) => {
  buttonSubmit.disabled = true;
  const email$ = fromEvent(inputEmail, "input");
  const password$ = fromEvent(inputPassword, "input");
  const source$ = from([email$, password$]).pipe(combineAll());
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
        pluck("response", "anime"),
        map((anime) => {
          anime = anime.filter(
            (movie) => movie.airing_start && limitAdultGenre(movie.genres)
          );
          updateMaxPage(
            Math.ceil(anime.length / stream.initialState.numberOfProduct)
          );
          updateOriginalData(anime);
          updateIsLoading(false);
          stream.catchingError(null);
          return orderBy(anime, ["airing_start"], ["desc"]).slice(
            (page - 1) * numberOfProducts,
            page * numberOfProducts
          );
        }),
        catchError((error) => {
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

function limitAdultGenre(genres) {
  let check = true;
  genres.forEach((genre) => {
    if (genre.name === "Hentai") {
      check = false;
    }
  });
  return check;
}

export const changeCurrentPage$ = () => {
  return fromEvent(document, "keydown").pipe(
    filter((v) => v.target.tagName === "BODY"),
    pluck("keyCode"),
    map((keyCode) => {
      switch (keyCode) {
        case 39:
          allowScrollToSeeMore(true);
          stream.increaseCurrentPage();
          return;
        case 37:
          allowScrollToSeeMore(true);
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
      return of("");
    }),
    switchMap((text) =>
      text
        ? ajax("https://api.jikan.moe/v4/search/anime?q=" + text).pipe(
            pluck("response", "results"),
            map((data) => {
              const dataSearched = data;
              return dataSearched;
            }),
            catchError((err) => {
              return of([]);
            })
          )
        : of([])
    ),
    tap((data) => stream.updateDataFilter(data))
  );
};

export const fetchTopMovie$ = () => {
  return timer(0).pipe(
    switchMapTo(
      ajax({
        url: "https://api.jikan.moe/v3/top/anime/1/airing",
      }).pipe(
        pluck("response", "top"),
        catchError((err) => {
          return of([]);
        })
      )
    ),
    tap((topMovieList) => stream.updateTopMovie(topMovieList))
  );
};

export const fetchUpdatedMovie$ = () => {
  return timer(0).pipe(
    switchMapTo(
      ajax({
        url: "/api/movies/latest",
      }).pipe(
        pluck("response", "message"),
        tap((updatedMovie) => {
          stream.updateUpdatedMovie(updatedMovie);
        }),
        catchError(() => of([]))
      )
    )
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
          return of([]);
        }),
        tap((v) => stream.updateDataSchedule({ [day]: v }))
      )
    )
  );
};

export const fetchBoxMovie$ = (idCartoonUser) => {
  return timer(0).pipe(
    switchMap(() =>
      ajax({
        url: "/api/movies/box/",
        headers: {
          authorization: `Bearer ${idCartoonUser}`,
        },
      }).pipe(
        pluck("response", "message"),
        catchError((err) => from([]))
      )
    ),
    tap((v) => {
      stream.updateBoxMovie(v);
    })
  );
};

export const listenSearchInputPressEnter$ = (searchInputE) => {
  return fromEvent(searchInputE, "keydown").pipe(
    filter((e) => e.keyCode === 13),
    pluck("target", "value")
  );
};
