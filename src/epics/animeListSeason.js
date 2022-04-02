import { from, fromEvent, of, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  combineAll,
  filter,
  map,
  pluck,
  retry,
  startWith,
  switchMapTo,
} from "rxjs/operators";

import animeListSeasonStore from "../store/animeListSeason";

export const animeListSeasonStream = animeListSeasonStore;

export const changeCurrentPage$ = () => {
  return fromEvent(document, "keydown").pipe(
    filter((v) => v.target.tagName === "BODY"),
    pluck("keyCode"),
    map((keyCode) => {
      switch (keyCode) {
        case 39:
          animeListSeasonStream.increaseCurrentPage();
          animeListSeasonStream.updateData({ shouldScrollToSeeMore: true });
          return;
        case 37:
          animeListSeasonStream.decreaseCurrentPage();
          animeListSeasonStream.updateData({ shouldScrollToSeeMore: true });
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
  selectScoreElement
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

  return from([
    listenEventYear$.pipe(startWith(animeListSeasonStream.currentState().year)),
    listenEventSeason$.pipe(
      startWith(animeListSeasonStream.currentState().season)
    ),
    listenEventScore$.pipe(
      startWith(animeListSeasonStream.currentState().score)
    ),
  ]).pipe(combineAll());
};

export const fetchAnimeSeason$ = (
  year,
  season,
  page
) => {
  return timer(0).pipe(
    switchMapTo(
      ajax(
        `https://api.jikan.moe/v4/seasons/${year}/${season}?page=${page}`
      ).pipe(
        pluck("response"),
        map((anime) => {
          animeListSeasonStream.updateDataQuick({
            maxPage: anime.pagination.last_visible_page,
          });
          return anime.data;
          // // updateOriginalData(anime);
          // console.log(anime);
          // animeListSeasonStream.updateData({
          //   dataDetailOriginal: anime,
          // })
          // anime = anime.filter((movie) => {
          //   if (animeListSeasonStream.currentState().modeFilter === "all") {
          //     return (
          //       movie.airing_start &&
          //       (checkAnimeIncludeGenre(
          //         movie.genres,
          //         animeListSeasonStream.currentState().genreId
          //       ) ||
          //         checkAnimeIncludeGenre(
          //           movie.explicit_genres,
          //           animeListSeasonStream.currentState().genreId
          //         )) &&
          //       (movie.score > score || score === 0)
          //     );
          //   }
          //   return (
          //     movie.airing_start &&
          //     limitAdultGenre(movie.explicit_genres) &&
          //     (checkAnimeIncludeGenre(
          //       movie.genres,
          //       animeListSeasonStream.currentState().genreId
          //     ) ||
          //       checkAnimeIncludeGenre(
          //         movie.explicit_genres,
          //         animeListSeasonStream.currentState().genreId
          //       )) &&
          //     (movie.score > score || score === 0)
          //   );
          // });
          // animeListSeasonStream.updateDataQuick({
          //   maxPage: Math.ceil(
          //     anime.length / animeListSeasonStream.initialState.numberOfProduct
          //   ),
          // });
          // let sortedArray = orderBy(anime, ["airing_start"], ["desc"]);
          // const latestAiringIndex = sortedArray.findIndex(
          //   (anime) =>
          //     new Date(anime.airing_start).getTime() <=
          //     new Date(Date.now()).getTime()
          // );
          // if (
          //   animeListSeasonStream.initialState.year === year &&
          //   animeListSeasonStream.initialState.season === season
          // ) {
          //   page = Math.ceil((latestAiringIndex + 1) / numberOfProducts);
          //   animeListSeasonStream.updateData({ currentPage: page });
          // } else {
          //   animeListSeasonStream.updateData({ currentPage: 1 });
          // }
          // if (page === 0) page = 1;
          // sortedArray = sortedArray.slice(
          //   (page - 1) * numberOfProducts,
          //   page * numberOfProducts
          // );
          // return sortedArray;
        }),
        retry(20),
        catchError(() => {
          return of([]);
        })
      )
    )
  );
};
