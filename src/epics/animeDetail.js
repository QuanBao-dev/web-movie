import capitalize from "lodash/capitalize";
import { fromEvent, of, timer } from "rxjs";
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
  tap,
} from "rxjs/operators";

import animeDetailStore from "../store/animeDetail";

export const animeDetailStream = animeDetailStore;

export const fetchData$ = (name) => {
  return timer(0).pipe(
    tap(() => {
      animeDetailStream.updateIsLoading(true, "isLoadingInfoAnime");
    }),
    mergeMapTo(
      ajax(`https://api.jikan.moe/v3/anime/${name}`).pipe(
        retry(),
        pluck("response")
      )
    )
  );
};

export const fetchDataVideo$ = (malId) => {
  return timer(0).pipe(
    tap(() => {
      animeDetailStream.updateIsLoading(true, "isLoadingVideoAnime");
    }),
    mergeMapTo(
      ajax(`https://api.jikan.moe/v3/anime/${malId}/videos`).pipe(
        retry(5),
        pluck("response"),
        catchError((error) => of({ error }))
      )
    )
  );
};

export const fetchEpisodeDataVideo$ = (malId) => {
  return timer(0).pipe(
    tap(() => {
      animeDetailStream.updateIsLoading(true, "isLoadingEpisode");
    }),
    mergeMapTo(
      ajax(`/api/movies/${malId}/episodes`).pipe(
        pluck("response"),
        catchError(() => {
          console.log("Don't have episodes");
          return of({ error: "Don't have episodes" });
        })
      )
    )
  );
};

export function fetchLargePicture$(name) {
  return timer(0).pipe(
    tap(() => {
      animeDetailStream.updateIsLoading(true, "isLoadingLargePicture");
    }),
    mergeMapTo(
      ajax(`https://api.jikan.moe/v3/anime/${name}/pictures`).pipe(
        retry(10),
        pluck("response", "pictures"),
        map((pictures) => ({ pictures })),
        catchError(() => of([]))
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

export function fetchAnimeRecommendation$(malId) {
  return timer(0).pipe(
    tap(() => {
      animeDetailStream.updateIsLoading(true, "isLoadingRelated");
    }),
    mergeMapTo(
      ajax({
        url: `https://api.jikan.moe/v3/anime/${malId}/recommendations`,
      }).pipe(
        retry(null),
        pluck("response", "recommendations"),
        catchError(() => of([]))
      )
    )
  );
}

export function fetchDataCharacter$(malId) {
  return timer(0).pipe(
    tap(() => {
      animeDetailStream.updateIsLoading(true, "isLoadingCharacter");
    }),
    mergeMapTo(
      ajax(`https://api.jikan.moe/v3/anime/${malId}/characters_staff`).pipe(
        retry(20),
        pluck("response", "characters"),
        catchError(() => of([]))
      )
    )
  );
}

export function handleAddBoxMovie(
  addMovieRef,
  deleteMovieRef,
  idCartoonUser,
  malId
) {
  return timer(0)
    .pipe(
      filter(() => addMovieRef.current),
      debounceTime(500),
      map(() => addMovieRef.current),
      switchMap((target) => {
        return fromEvent(target, "click").pipe(
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
                  animeDetailStream.currentState().dataInformationAnime
                    .synopsis,
              },
            }).pipe(
              pluck("response", "message"),
              catchError((err) => {
                return of();
              })
            )
          )
        );
      })
    )
    .subscribe((v) => {
      // console.log(v);
      animeDetailStream.updateData({
        boxMovie: v === null ? null : { ...v },
      });
      handleDeleteBoxMovie(addMovieRef, deleteMovieRef, idCartoonUser, malId);
    });
}

export function handleDeleteBoxMovie(
  addMovieRef,
  deleteMovieRef,
  idCartoonUser,
  malId
) {
  return timer(0)
    .pipe(
      filter(() => deleteMovieRef.current),
      debounceTime(500),
      map(() => deleteMovieRef.current),
      switchMap((target) => {
        return fromEvent(target, "click").pipe(
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
              catchError((err) => {
                return of();
              })
            )
          )
        );
      })
    )
    .subscribe((v) => {
      animeDetailStream.updateData({
        boxMovie: null,
      });
      handleAddBoxMovie(addMovieRef, deleteMovieRef, idCartoonUser, malId);
    });
}
