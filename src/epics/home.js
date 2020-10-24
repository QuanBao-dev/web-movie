/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import orderBy from 'lodash/orderBy';
import { asyncScheduler, from, fromEvent, interval, of, timer } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  catchError,
  combineAll,
  debounceTime,
  exhaustMap,
  filter,
  map,
  mergeMap,
  pluck,
  retry,
  startWith,
  switchMap,
  switchMapTo,
  takeWhile,
  tap,
  throttleTime,
} from 'rxjs/operators';

import homeStore, {
  savingTextSearch,
  updateMaxPage,
  updateModeScrolling,
  updateOriginalData,
  updatePageTopMovieOnDestroy,
} from '../store/home';

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

export const fetchAnimeSeason$ = (
  year,
  season,
  page,
  numberOfProducts,
  score
) => {
  return timer(0).pipe(
    switchMapTo(
      ajax(`https://api.jikan.moe/v3/season/${year}/${season}`).pipe(
        pluck("response", "anime"),
        map((anime) => {
          updateOriginalData(anime);
          anime = anime.filter((movie) => {
            if (stream.currentState().modeFilter === "all") {
              return (
                movie.airing_start &&
                checkAnimeIncludeGenre(
                  movie.genres,
                  stream.currentState().genreId
                ) &&
                (movie.score > score || score === 0)
              );
            }
            return (
              movie.airing_start &&
              limitAdultGenre(movie.genres) &&
              checkAnimeIncludeGenre(
                movie.genres,
                stream.currentState().genreId
              ) &&
              (movie.score > score || score === 0)
            );
          });
          updateMaxPage(
            Math.ceil(anime.length / stream.initialState.numberOfProduct)
          );
          stream.catchingError(null);
          let sortedArray = orderBy(anime, ["airing_start"], ["desc"]);
          const latestAiringIndex = sortedArray.findIndex(
            (anime) =>
              new Date(anime.airing_start).getTime() <=
              new Date(Date.now()).getTime()
          );
          if (
            stream.initialState.year === year &&
            stream.initialState.season === season
          ) {
            page = Math.ceil((latestAiringIndex + 1) / numberOfProducts);
            stream.updateCurrentPage(page);
          }
          if (page === 0) page = 1;
          sortedArray = sortedArray.slice(
            (page - 1) * numberOfProducts,
            page * numberOfProducts
          );
          return sortedArray;
        }),
        retry(20),
        catchError((error) => {
          stream.catchingError(error);
          return of([]);
        })
      )
    )
  );
};

export function limitAdultGenre(genres) {
  let check = true;
  genres.forEach((genre) => {
    if (genre.name === "Hentai") {
      check = false;
    }
  });
  return check;
}

export function checkAnimeIncludeGenre(genresAnime, genreCheckMalId) {
  let check = false;
  if (genreCheckMalId === "0") {
    return true;
  }
  genresAnime.forEach((genre) => {
    if (genre.mal_id.toString() === genreCheckMalId) {
      check = true;
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
          stream.allowScrollToSeeMore(true);
          stream.increaseCurrentPage();
          return;
        case 37:
          stream.allowScrollToSeeMore(true);
          stream.decreaseCurrentPage();
          return;
        default:
          return;
      }
    })
  );
};

export const changeSeasonYear$ = (
  selectYearElement,
  selectSeasonElement,
  selectScoreElement,
  selectModeFilterElement,
  selectGenreElement
) => {
  // console.log("change")
  const listenEventYear$ = fromEvent(selectYearElement, "change").pipe(
    pluck("target", "value"),
    map((v) => parseInt(v))
  );
  const listenEventSeason$ = fromEvent(selectSeasonElement, "change").pipe(
    pluck("target", "value")
  );
  const listenEventScore$ = fromEvent(selectScoreElement, "change").pipe(
    pluck("target", "value"),
    map((v) => parseInt(v))
  );
  const listenEventModeFilter$ = fromEvent(
    selectModeFilterElement,
    "change"
  ).pipe(pluck("target", "value"));
  const listenEventGenre$ = fromEvent(selectGenreElement, "change").pipe(
    pluck("target", "value")
  );
  return from([
    listenEventYear$.pipe(startWith(stream.currentState().year)),
    listenEventSeason$.pipe(startWith(stream.currentState().season)),
    listenEventScore$.pipe(startWith(stream.currentState().score)),
    listenEventModeFilter$.pipe(startWith(stream.currentState().modeFilter)),
    listenEventGenre$.pipe(startWith(stream.currentState().genreId)),
  ]).pipe(combineAll());
};

export const changeSearchInput$ = (searchInputElement) => {
  const searchedInput$ = fromEvent(searchInputElement, "input");
  return searchedInput$.pipe(
    debounceTime(300),
    pluck("target", "value"),
    tap((text) => savingTextSearch(text)),
    retry(20),
    catchError(() => {
      return of("");
    }),
    mergeMap((text) =>
      text
        ? ajax("https://api.jikan.moe/v3/search/anime?q=" + text).pipe(
            pluck("response", "results"),
            map((data) => {
              const dataSearched = data;
              return dataSearched;
            }),
            retry(20),
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
    tap(() => stream.updateAllowIncreasePageTopMovie(false)),
    exhaustMap(() =>
      ajax({
        url: `https://api.jikan.moe/v3/top/anime/${
          stream.currentState().pageTopMovie
        }`,
      }).pipe(
        pluck("response", "top"),
        tap(() => {
          stream.updateAllowIncreasePageTopMovie(true);
          updatePageTopMovieOnDestroy(stream.currentState().pageTopMovie);
        }),
        retry(5),
        catchError((err) => {
          stream.updateIsStopFetchTopMovie(true);
          stream.updateAllowIncreasePageTopMovie(false);
          return of(stream.currentState().dataTopMovie);
        })
      )
    )
  );
};

export const fetchUpdatedMovie$ = () => {
  return timer(0).pipe(
    switchMapTo(
      ajax({
        url:
          "/api/movies/latest?page=" +
          stream.currentState().currentPageUpdatedMovie,
      }).pipe(
        pluck("response", "message"),
        retry(20),
        catchError(() => of([]))
      )
    )
  );
};

export const fetchAnimeSchedule$ = (weekIndex) => {
  const source$ = from(weekIndex);
  return source$.pipe(
    mergeMap((day) =>
      timer(0).pipe(
        filter(() => !stream.currentState().dataScheduleMovie[day]),
        mergeMap(() =>
          ajax(`https://api.jikan.moe/v3/schedule/${day}`).pipe(
            pluck("response", day),
            retry(20),
            catchError((err) => {
              return of([]);
            }),
            tap((v) => stream.updateDataSchedule({ [day]: v }))
          )
        )
      )
    )
  );
};

export const fetchBoxMovie$ = (idCartoonUser) => {
  return timer(0).pipe(
    switchMap(() =>
      ajax({
        url:
          "/api/movies/box?page=" + stream.currentState().currentPageBoxMovie,
        headers: {
          authorization: `Bearer ${idCartoonUser}`,
        },
      }).pipe(
        pluck("response", "message"),
        retry(20),
        catchError((err) => from([]))
      )
    )
  );
};

export const listenSearchInputPressEnter$ = (searchInputE) => {
  return fromEvent(searchInputE, "keydown").pipe(
    filter((e) => e.keyCode === 13),
    pluck("target", "value")
  );
};

export const topMovieUpdatedScrolling$ = (topAnimeElement) => {
  return fromEvent(
    stream.currentState().screenWidth > 1510 ? topAnimeElement : window,
    "scroll"
  ).pipe(
    debounceTime(500),
    filter(() =>
      stream.currentState().screenWidth > 1510
        ? topAnimeElement.scrollTop - (topAnimeElement.scrollHeight - 5000) > 0
        : document.body.scrollHeight - (window.scrollY + 2000) < 0
    ),
    tap(() => {
      if (
        8 + (stream.currentState().pageSplitTopMovie - 1) * 5 <=
        stream.currentState().dataTopMovie.length
      )
        stream.updatePageSplitTopMovie(
          stream.currentState().pageSplitTopMovie + 1
        );
    })
  );
};

export const upcomingAnimeListUpdated$ = () => {
  return timer(0).pipe(
    switchMap(() =>
      ajax({
        url: `https://api.jikan.moe/v3/top/anime/1/upcoming`,
      }).pipe(
        pluck("response", "top"),
        retry(),
        catchError(() => of([]))
      )
    )
  );
};
export const scrollAnimeInterval$ = (scrollE, end) => {
  fromEvent(scrollE, "mouseenter").subscribe(() => {
    updateModeScrolling("enter");
  });
  fromEvent(scrollE, "mouseleave").subscribe(() => {
    updateModeScrolling("interval");
  });
  return interval(20).pipe(
    filter(() => stream.currentState().modeScrolling === "interval"),
    tap(() => {
      const offsetLeft = stream.currentState().offsetLeft - 2.4;
      stream.updateOffsetLeft(offsetLeft);
      scrollE.style.transform = `translateX(${offsetLeft}px)`;
    }),
    filter(
      () =>
        scrollE.childNodes[end] &&
        Math.abs(stream.currentState().offsetLeft) >=
          scrollE.childNodes[end].offsetLeft
    ),
    throttleTime(1000, asyncScheduler, {
      leading: true,
      trailing: false,
    })
  );
};
export const scrollAnimeUser$ = (
  distance,
  elementScroll,
  forward,
  numberList
) => {
  let deltaDistance = 0;
  let end = stream.currentState().upcomingAnimeList.length - 7;
  return timer(0, 2).pipe(
    takeWhile(() => deltaDistance < distance),
    tap(() => {
      updateModeScrolling("enter");
      stream.allowScrollLeft(false);
      deltaDistance += 10;
      let check = true;
      const offsetLeft =
        stream.currentState().offsetLeft - deltaDistance * forward;
      if (
        elementScroll.childNodes[end] &&
        Math.abs(offsetLeft) >= elementScroll.childNodes[end].offsetLeft
      ) {
        stream.updateOffsetLeft(
          -elementScroll.childNodes[end - numberList].offsetLeft
        );
        elementScroll.style.transition = "0s";
        elementScroll.style.transform = `translateX(${
          stream.currentState().offsetLeft
        })`;
        check = false
      }
      if (
        elementScroll.childNodes[0] &&
        offsetLeft - elementScroll.childNodes[0].offsetLeft > 0
      ) {
        stream.updateOffsetLeft(
          -elementScroll.childNodes[numberList].offsetLeft
        );
        elementScroll.style.transition = "0s";
        elementScroll.style.transform = `translateX(${
          stream.currentState().offsetLeft
        })`;
        check = false
      }
      if (check)
        elementScroll.style.transform = `translateX(${
          stream.currentState().offsetLeft - deltaDistance * forward
        }px)`;
    }),
    filter(() => deltaDistance >= distance),
    tap(() =>{
      stream.updateOffsetLeft(
        stream.currentState().offsetLeft - deltaDistance * forward
      );
      stream.allowScrollLeft(true);
      updateModeScrolling("interval");
    }
    )
  );
};
