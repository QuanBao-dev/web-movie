import { from } from "rxjs";
import { concatAll, map, tap } from "rxjs/operators";

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
  history
) => {
  return () => {
    const fetchDataInfo$ = fetchData$(malId).pipe(tap((v) => {}));
    const fetchDataVideoPromo$ = fetchDataVideo$(malId).pipe(
      tap(({ promo, error }) => {
        if (error) return;
        if (promo) {
          animeDetailStream.updateData({
            dataVideoPromo: promo,
          });
        }
        animeDetailStream.updateIsLoading(false, "isLoadingVideoAnime");
      })
    );
    const fetchLargePictureUrl$ = fetchLargePicture$(malId, history).pipe(
      tap(({ pictures, error }) => {
        if (error) {
          animeDetailStream.updateData({ isLoadingLargePicture: false });
          return;
        }
        try {
          animeDetailStream.updateData({
            dataLargePictureList: pictures
              .slice(0, Math.ceil(pictures.length / 2))
              .reverse(),
            isLoadingLargePicture: false,
          });
          document.body.style.backgroundImage = `url(${
            animeDetailStream.currentState().dataLargePictureList[0]
          })`;
          document.body.style.backgroundSize = "contain";
        } catch (error) {
          animeDetailStream.updateData({ isLoadingLargePicture: false });
          console.log(error);
        }
      })
    );
    const fetchEpisodesUrlSub = fetchEpisodeDataVideo$(malId)
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
    const fetchAnimeAppears$ = fetchAnimeRecommendation$(malId).pipe(
      tap((data) => {
        const handledData = data.map(({ entry, votes }) => ({
          ...entry,
          recommendation_count: votes,
        }));
        animeDetailStream.updateIsLoading(false, "isLoadingRelated");
        animeDetailStream.updateData({
          dataRelatedAnime: handledData,
        });
      })
    );
    const fetchCharacters$ = fetchDataCharacter$(malId).pipe(
      tap((data) => {
        animeDetailStream.updateIsLoading(false, "isLoadingCharacter");
        characterStream.updateData({
          dataCharacter: data,
          dataCharacterRaw: data,
        });
      })
    );
    const fetchInformation$ = from([
      fetchDataInfo$.pipe(map((data) => ({ ...data, type_data: "data info" }))),
      fetchAnimeThemes$(malId).pipe(
        map((data) => ({ ...data, type_data: "themes" }))
      ),
      fetchAnimeExternal$(malId).pipe(
        map((data) => ({ ...data, type_data: "externals" }))
      ),
    ]).pipe(
      concatAll(),
      tap((data) => {
        if (data.error) return;
        switch (data.type_data) {
          case "data info":
            animeDetailStream.updateData({
              dataInformationAnime: {
                ...data,
                opening_themes: "",
                ending_themes: "",
                external_links: {},
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
              (data && data.openings.length > 3) ||
              (data && data.endings.length > 3)
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
        fetchLargePictureUrl$,
        fetchInformation$,
        fetchAnimeAppears$,
        fetchCharacters$,
        fetchDataVideoPromo$.pipe(
          tap(() => {
            characterStream.updateData({ page: 1 });
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
  deleteMovieRef
) => {
  return () => {
    const subscription = fetchBoxMovieOneMovie$(malId, idCartoonUser).subscribe(
      (api) => {
        if (!api.error) {
          animeDetailStream.updateData({
            boxMovie: api.message === null ? null : { ...api.message },
          });
          handleDeleteBoxMovie(
            addMovieRef,
            deleteMovieRef,
            idCartoonUser,
            malId
          );
        } else {
          animeDetailStream.updateData({
            boxMovie: null,
          });
          handleAddBoxMovie(addMovieRef, deleteMovieRef, idCartoonUser, malId);
        }
      }
    );
    return () => {
      subscription && subscription.unsubscribe();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };
  };
};
