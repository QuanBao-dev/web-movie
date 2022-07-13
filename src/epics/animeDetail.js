import capitalize from "lodash/capitalize";
import { fromEvent, iif, of, throwError, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  debounceTime,
  exhaustMap,
  filter,
  map,
  mergeMapTo,
  pluck,
  retry,
  switchMap,
  switchMapTo,
  takeWhile,
  tap,
  delay,
} from "rxjs/operators";

import animeDetailStore from "../store/animeDetail";
import cachesStore from "../store/caches";

export const animeDetailStream = animeDetailStore;

export const fetchData$ = (name, type) => {
  return timer(0).pipe(
    tap(() => {
      animeDetailStream.updateIsLoading(true, "isLoadingInfoAnime");
      animeDetailStream.updateData({
        isAddMode: null,
      });
    }),
    mergeMapTo(
      iif(
        () =>
          cachesStore.currentState()[name] &&
          cachesStore.currentState()[name].dataInfo,
        timer(0).pipe(map(() => cachesStore.currentState()[name].dataInfo)),
        timer(0).pipe(
          delay(1500),
          mergeMapTo(
            ajax(`https://api.jikan.moe/v4/${type}/${name}`).pipe(
              pluck("response", "data"),
              retry(1),
              switchMap((data) => {
                if ([404, 500].includes(data.status)) {
                  return throwError("404 error");
                }
                return of(data);
              })
            )
          )
        )
      )
    )
  );
};

export const fetchAnimeThemes$ = (malId, type) => {
  return timer(0).pipe(
    mergeMapTo(
      iif(
        () =>
          cachesStore.currentState()[malId] &&
          cachesStore.currentState()[malId].themes,
        timer(0).pipe(map(() => cachesStore.currentState()[malId].themes)),
        timer(0).pipe(
          takeWhile(() => type === "anime"),
          switchMapTo(
            ajax(`https://api.jikan.moe/v4/${type}/${malId}/themes`).pipe(
              retry(6),
              pluck("response", "data")
            )
          )
        )
      )
    )
  );
};

export const fetchAnimeExternal$ = (malId, type) => {
  return timer(0).pipe(
    mergeMapTo(
      iif(
        () =>
          cachesStore.currentState()[malId] &&
          cachesStore.currentState()[malId].externals,
        timer(0).pipe(map(() => cachesStore.currentState()[malId].externals)),
        timer(0).pipe(
          delay(1500),
          mergeMapTo(
            ajax(`https://api.jikan.moe/v4/${type}/${malId}/external`).pipe(
              retry(6),
              pluck("response", "data")
            )
          )
        )
      )
    )
  );
};

export const fetchDataVideo$ = (malId, type) => {
  return iif(
    () =>
      cachesStore.currentState()[malId] &&
      cachesStore.currentState()[malId].dataVideoPromo,
    timer(0).pipe(map(() => cachesStore.currentState()[malId].dataVideoPromo)),
    timer(0).pipe(
      takeWhile(() => type === "anime"),
      tap(() => {
        animeDetailStream.updateIsLoading(true, "isLoadingVideoAnime");
      }),
      delay(1500),
      mergeMapTo(
        ajax(`https://api.jikan.moe/v4/anime/${malId}/videos`).pipe(
          retry(6),
          pluck("response", "data")
        )
      )
    )
  );
};

export const fetchEpisodeDataVideo$ = (malId, type) => {
  return timer(0).pipe(
    takeWhile(() => type === "anime"),
    tap(() => {
      animeDetailStream.updateIsLoading(true, "isLoadingEpisode");
    }),
    mergeMapTo(ajax(`/api/movies/${malId}/episodes`).pipe(pluck("response"))),
    catchError(() => {
      console.log("Don't have episodes");
      return of({ error: "Don't have episodes" });
    })
  );
};

export function fetchLargePicture$(name, type) {
  return timer(0).pipe(
    tap(() => {
      document.body.style.backgroundImage = `url(/background.jpg)`;
      document.body.style.backgroundSize = "cover";
      animeDetailStream.updateIsLoading(true, "isLoadingLargePicture");
    }),
    mergeMapTo(
      iif(
        () =>
          cachesStore.currentState()[name] &&
          cachesStore.currentState()[name].dataLargePictureList,
        timer(0).pipe(
          map(() => cachesStore.currentState()[name].dataLargePictureList)
        ),
        timer(0).pipe(
          delay(1500),
          mergeMapTo(
            ajax(`https://api.jikan.moe/v4/${type}/${name}/pictures`).pipe(
              pluck("response", "data"),
              retry(5),
              map((pictures) => ({
                pictures: pictures.map(
                  ({ jpg, webp }) => webp.large_image_url || jpg.large_image_url
                ),
              }))
            )
          )
        )
      )
    )
  );
}

export const fetchBoxMovieOneMovie$ = (malId, idCartoonUser) => {
  return ajax({
    url: `/api/movies/box/${malId}`,
    headers: {
      authorization: `Bearer ${idCartoonUser}`,
    },
  }).pipe(
    pluck("response"),
    catchError((error) => of({ error }))
  );
};

export function capitalizeString(string) {
  string = string.replace("_", " ");
  return capitalize(string);
}

export function fetchAnimeRecommendation$(malId, type) {
  return timer(0).pipe(
    tap(() => {
      animeDetailStream.updateIsLoading(true, "isLoadingRelated");
    }),
    delay(1500),
    mergeMapTo(
      ajax({
        url: `https://api.jikan.moe/v4/${type}/${malId}/recommendations`,
      }).pipe(
        retry(6),
        pluck("response", "data"),
        catchError((error) => of({ error }))
      )
    )
  );
}

export function fetchDataCharacter$(malId, type) {
  return timer(0).pipe(
    tap(() => {
      animeDetailStream.updateIsLoading(true, "isLoadingCharacter");
    }),
    mergeMapTo(iif(
      () =>
        cachesStore.currentState()[malId] &&
        cachesStore.currentState()[malId].dataCharacter,
      timer(0).pipe(map(() => cachesStore.currentState()[malId].dataCharacter)),
      timer(0).pipe(
        mergeMapTo(
          ajax(`https://api.jikan.moe/v4/${type}/${malId}/characters`).pipe(
            retry(20),
            pluck("response", "data"),
            catchError((error) => of({ error }))
          )
        )
      )
    ))
  );
}

export function handleAddBoxMovie(addMovieRef, idCartoonUser, isAddMode) {
  return timer(0).pipe(
    debounceTime(500),
    filter(() => isAddMode === true && addMovieRef.current),
    switchMap(() => {
      return fromEvent(addMovieRef.current, "click").pipe(
        filter(() => animeDetailStream.currentState().dataInformationAnime),
        exhaustMap(() =>
          ajax({
            method: "POST",
            url: "/api/movies/box",
            headers: {
              authorization: `Bearer ${idCartoonUser}`,
            },
            body: {
              malId:
                animeDetailStream.currentState().dataInformationAnime.mal_id,
              title:
                animeDetailStream.currentState().dataInformationAnime.title,
              imageUrl:
                animeDetailStream.currentState().dataLargePictureList[0],
              episodes:
                animeDetailStream.currentState().dataInformationAnime
                  .episodes || "??",
              score:
                animeDetailStream.currentState().dataInformationAnime.score,
              airing:
                animeDetailStream.currentState().dataInformationAnime.airing,
              synopsis:
                animeDetailStream.currentState().dataInformationAnime.synopsis,
            },
          }).pipe(
            pluck("response", "message"),
            map((data) => ({ ...data, typeResponse: "handle add box" })),
            catchError(() => {
              animeDetailStream.updateData({
                triggerFetch: !animeDetailStream.currentState().triggerFetch,
              });
            })
          )
        )
      );
    })
  );
}

export function handleDeleteBoxMovie(
  deleteMovieRef,
  idCartoonUser,
  malId,
  isAddMode
) {
  return timer(0).pipe(
    debounceTime(500),
    filter(() => isAddMode === false && deleteMovieRef.current),
    switchMap(() => {
      return fromEvent(deleteMovieRef.current, "click").pipe(
        filter(() => animeDetailStream.currentState().dataInformationAnime),
        exhaustMap(() =>
          ajax({
            method: "DELETE",
            url: `/api/movies/box/${malId}`,
            headers: {
              authorization: `Bearer ${idCartoonUser}`,
            },
          }).pipe(
            pluck("response", "message"),
            map((data) => ({ ...data, typeResponse: "handle delete box" })),
            catchError(() => {
              animeDetailStream.updateData({
                triggerFetch: !animeDetailStream.currentState().triggerFetch,
              });
            })
          )
        )
      );
    })
  );
}
