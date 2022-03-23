import capitalize from "lodash/capitalize";
import { fromEvent, of, throwError, timer } from "rxjs";
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
import storageAnimeStore from "../store/storageAnime";

export const animeDetailStream = animeDetailStore;

export const fetchData$ = (name, history) => {
  return timer(0).pipe(
    tap(() => {
      animeDetailStream.updateIsLoading(true, "isLoadingInfoAnime");
    }),
    mergeMapTo(
      ajax(`https://api.jikan.moe/v4/anime/${name}`).pipe(
        pluck("response", "data"),
        retry(6),
        switchMap((data) => {
          if ([404, 500].includes(data.status)) {
            return throwError("404 error");
          }
          return of(data);
        }),
        catchError(() => {
          history.push(
            "/storage/?page=" + storageAnimeStore.currentState().page
          );
          // history.goBack();
          alert("Anime not found");
          of({ error: "something went wrong" });
        })
      )
    )
  );
};

export const fetchAnimeThemes$ = (malId) => {
  return ajax(`https://api.jikan.moe/v4/anime/${malId}/themes`).pipe(
    retry(6),
    pluck("response", "data"),
    catchError(() => of({ error: "something went wrong" }))
  );
};

export const fetchAnimeExternal$ = (malId) => {
  return ajax(`https://api.jikan.moe/v4/anime/${malId}/external`).pipe(
    retry(6),
    pluck("response", "data"),
    catchError(() => of({ error: "something went wrong" }))
  );
};

export const fetchDataVideo$ = (malId) => {
  return timer(0).pipe(
    tap(() => {
      animeDetailStream.updateIsLoading(true, "isLoadingVideoAnime");
    }),
    mergeMapTo(
      ajax(`https://api.jikan.moe/v4/anime/${malId}/videos`).pipe(
        retry(6),
        pluck("response", "data"),
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
      document.body.style.backgroundImage = `url(/background.jpg)`;
      document.body.style.backgroundSize = "cover";
      animeDetailStream.updateIsLoading(true, "isLoadingLargePicture");
    }),
    mergeMapTo(
      ajax(`https://api.jikan.moe/v4/anime/${name}/pictures`).pipe(
        pluck("response", "data"),
        retry(5),
        map((pictures) => ({
          pictures: pictures.map(
            ({ jpg, webp }) => webp.large_image_url || jpg.large_image_url
          ),
        })),
        catchError(() => {
          return of({ error: "cancel request" });
        })
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
        url: `https://api.jikan.moe/v4/anime/${malId}/recommendations`,
      }).pipe(
        retry(6),
        pluck("response", "data"),
        catchError((error) => of({ error }))
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
      ajax(`https://api.jikan.moe/v4/anime/${malId}/characters`).pipe(
        retry(20),
        pluck("response", "data"),
        catchError((error) => of({ error }))
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
