import { from, of } from "rxjs";
import {
  concatAll,
  delay,
  map,
  tap,
  catchError,
  switchMap,
} from "rxjs/operators";

import {
  animeDetailStream,
  fetchAnimeExternal$,
  fetchAnimeRecommendation$,
  fetchAnimeThemes$,
  fetchBoxMovieOneMovie$,
  fetchData$,
  fetchDataCharacter$,
  fetchDataVideo$,
  fetchEpisodeDataVideo$,
  fetchLargePicture$,
  handleAddBoxMovie,
  handleDeleteBoxMovie,
} from "../epics/animeDetail";
import { characterStream } from "../epics/character";
import { fetchReviewsData$, reviewsStream } from "../epics/reviews";

export const initAnimeDetailState = (setNameState) => {
  return () => {
    const subscription2 = animeDetailStream.subscribe(setNameState);
    animeDetailStream.init();
    // window.scroll({ top: 0 });
    return () => {
      document.title = `My Anime Fun - Watch latest anime in high quality`;
      subscription2.unsubscribe();
    };
  };
};

export const fetchData = (
  malId,
  linkWatchingInputElement,
  setShowThemeMusic,
  type
) => {
  return () => {
    const fetchDataInfo$ = fetchData$(malId, type);
    const fetchDataVideoPromo$ = fetchDataVideo$(malId, type).pipe(
      tap((data) => {
        if (!data || data.error) return;
        const { promo } = data;
        if (promo) {
          animeDetailStream.updateData({
            dataVideoPromo: promo,
          });
        }
        animeDetailStream.updateIsLoading(false, "isLoadingVideoAnime");
      })
    );
    const fetchLargePictureUrl$ = fetchLargePicture$(malId, type).pipe(
      tap(({ pictures, error }) => {
        if (error) {
          animeDetailStream.updateData({ isLoadingLargePicture: false });
          return;
        }
        try {
          animeDetailStream.updateData({
            dataLargePictureList: pictures.reverse(),
            isLoadingLargePicture: false,
          });
          if (animeDetailStream.currentState().dataLargePictureList[0])
            document.body.style.backgroundImage = `url(${
              animeDetailStream.currentState().dataLargePictureList[0]
            })`;
          else document.body.style.backgroundImage = `url(/background.jpg)`;

          document.body.style.backgroundSize = "contain";
        } catch (error) {
          document.body.style.backgroundImage = `url(/background.jpg)`;
          animeDetailStream.updateData({ isLoadingLargePicture: false });
          console.log(error);
        }
      })
    );
    const fetchEpisodesUrlSub = fetchEpisodeDataVideo$(malId, type)
      .pipe(
        tap((api) => {
          if (!api.error) {
            animeDetailStream.updateIsLoading(false, "isLoadingEpisode");
            if (linkWatchingInputElement)
              linkWatchingInputElement.value = api.message.source;
            animeDetailStream.updateData({
              dataEpisodesAnime: api.message,
            });
          } else {
            animeDetailStream.updateIsLoading(false, "isLoadingEpisode");
            animeDetailStream.updateData({
              dataEpisodesAnime: {},
            });
          }
        })
      )
      .subscribe();
    const fetchAnimeAppears$ = fetchAnimeRecommendation$(malId, type).pipe(
      tap((data) => {
        animeDetailStream.updateIsLoading(false, "isLoadingRelated");
        if (!data || data.error) return;
        const handledData = data.map(({ entry, votes }) => ({
          ...entry,
          recommendation_count: votes,
        }));
        animeDetailStream.updateData({
          dataRelatedAnime: handledData,
        });
      })
    );
    const fetchCharacters$ = fetchDataCharacter$(malId, type).pipe(
      tap((data) => {
        animeDetailStream.updateIsLoading(false, "isLoadingCharacter");
        if (!data || data.error) return;
        characterStream.updateData({
          dataCharacter: data,
          dataCharacterRaw: data,
          page: 1,
        });
      })
    );
    const fetchInformation$ = from([
      fetchDataInfo$.pipe(
        map((data) => ({ ...data, type_data: "data info" })),
        catchError(() => {
          return of({ error: "something went wrong" });
        })
      ),
      fetchAnimeThemes$(malId, type).pipe(
        map((data) => ({ ...data, type_data: "themes" })),
        catchError(() => {
          return of({ error: "something went wrong" });
        })
      ),
      fetchAnimeExternal$(malId, type).pipe(
        map((data) => ({ ...data, type_data: "externals" })),
        catchError(() => {
          return of({ error: "something went wrong" });
        })
      ),
    ]).pipe(
      concatAll(),
      tap((data) => {
        if (!data || data.error) return;
        switch (data.type_data) {
          case "data info":
            animeDetailStream.updateData({
              dataInformationAnime: {
                ...data,
                opening_themes: "",
                ending_themes: "",
                external_links: {},
                broadcast:
                  data.broadcast && data.broadcast.day
                    ? [
                        `Day: ${data.broadcast.day}`,
                        `Time: ${data.broadcast.time}`,
                        `Timezone: ${data.broadcast.timezone}`,
                        `String: ${data.broadcast.string}`,
                      ]
                    : null,
              },
            });
            document.title =
              data.title || `My Anime Fun - Watch latest anime in high quality`;
            break;
          case "themes":
            animeDetailStream.updateData({
              dataInformationAnime: {
                ...animeDetailStream.currentState().dataInformationAnime,
                opening_themes: data.openings,
                ending_themes: data.endings,
              },
            });
            if (
              (data && data.openings && data.openings.length > 3) ||
              (data && data.endings && data.endings.length > 3)
            ) {
              setShowThemeMusic(false);
            } else {
              setShowThemeMusic(true);
            }
            break;
          case "externals":
            animeDetailStream.updateData({
              dataInformationAnime: {
                ...animeDetailStream.currentState().dataInformationAnime,
                external_links: data,
              },
              isLoadingInfoAnime: false,
            });
            break;
          default:
            break;
        }
      })
    );
    let subscription;
    if (animeDetailStream.currentState().malId !== malId) {
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
      animeDetailStream.resetState();
      subscription = from([
        fetchLargePictureUrl$.pipe(delay(1500)),
        fetchInformation$.pipe(delay(1500)),
        fetchCharacters$.pipe(delay(1500)),
        fetchAnimeAppears$.pipe(delay(1500)),
        fetchDataVideoPromo$.pipe(delay(1500)),
        fetchReviewsData$(
          malId,
          reviewsStream.currentState().pageReviewsData,
          type
        )
          .pipe(
            tap((v) => {
              if (v && !v.error) {
                let updatedAnime;
                if (
                  reviewsStream.currentState().reviewsData.length === 0 ||
                  reviewsStream.currentState().previousMalId !== malId
                ) {
                  updatedAnime = v;
                } else {
                  updatedAnime = reviewsStream
                    .currentState()
                    .reviewsData.concat(v);
                }
                if (v.length === 0) {
                  reviewsStream.updateData({ isStopFetchingReviews: true });
                  return;
                }
                reviewsStream.updateData({
                  reviewsData: updatedAnime,
                  previousMalId: malId,
                  pageReviewsOnDestroy:
                    reviewsStream.currentState().pageReviewsData,
                  shouldUpdatePageReviewData: true,
                });
                if (updatedAnime.length > 0)
                  animeDetailStream.updateData({
                    malId: animeDetailStream.currentState().malId,
                  });
              } else {
                reviewsStream.updateData({
                  isStopFetchingReviews: true,
                  shouldUpdatePageReviewData: false,
                });
              }
            })
          )
          .pipe(
            tap(() => {
              // console.log("done");
              animeDetailStream.updateData({ malId });
            })
          ),
      ])
        .pipe(concatAll())
        .subscribe(() => {});
    }
    return () => {
      linkWatchingInputElement && (linkWatchingInputElement.value = "");
      fetchEpisodesUrlSub.unsubscribe();
      subscription && subscription.unsubscribe();
      setShowThemeMusic(false);
    };
  };
};

export const fetchBoxMovieOneMovie = (
  malId,
  idCartoonUser,
  addMovieRef,
  deleteMovieRef,
  isAddMode
) => {
  return () => {
    const subscription = fetchBoxMovieOneMovie$(malId, idCartoonUser)
      .pipe(
        switchMap((api) => {
          if (!api.error) {
            animeDetailStream.updateData({ isAddMode: false });
            return handleDeleteBoxMovie(deleteMovieRef, idCartoonUser, malId, isAddMode);
          } else {
            animeDetailStream.updateData({ isAddMode: true });
            return handleAddBoxMovie(addMovieRef, idCartoonUser, isAddMode);
          }
        })
      )
      .subscribe((api) => {
        switch (api.typeResponse) {
          case "handle add box":
            animeDetailStream.updateData({
              isAddMode: false,
            });
            break;
          default:
            animeDetailStream.updateData({
              isAddMode: true,
            });
            break;
        }
      });
    return () => {
      subscription && subscription.unsubscribe();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };
  };
};
