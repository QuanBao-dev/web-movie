/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import { orderBy } from "lodash";
import { combineLatest, fromEvent } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map, pluck, tap, catchError } from "rxjs/operators";

import todoStore, { updateIsLoading, updateMaxPage } from "../store/todo";

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
  return ajax(`https://api.jikan.moe/v3/season/${year}/${season}`).pipe(
    tap(() => updateIsLoading(true)),
    pluck("response", "anime"),
    map((anime) => {
      if (!anime) {
        stream.handleError({
          status: 400,
          type: "HttpException",
          message:
            "Invalid or incomplete request. Please double check the request documentation",
          error: null,
        });
      } else {
        console.log("fetch");
        updateMaxPage(Math.ceil(anime.length / 12));
        return orderBy(anime, ["airing_start"], ["desc"]).slice(
          (page - 1) * numberOfProducts,
          page * numberOfProducts
        );
      }
    }),
    tap((v) => {
      stream.updateAnimeData(v);
      updateIsLoading(false);
    }),
    catchError((error) => {
      stream.handleError(error);
    })
  );
};

export const changeCurrentPage$ = () => {
  return fromEvent(document, "keydown").pipe(
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
    })
  );
};

export const changeSeason$ = (selectSeasonElement) => {
  const year$ = fromEvent(selectSeasonElement, "change");
  return year$.pipe(
    pluck("target", "value"),
    tap((season) => {
      stream.updateSeason(season);
    })
  );
};
