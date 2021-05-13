import { from } from "rxjs";
import { combineAll, tap } from "rxjs/operators";

import {
  animeDetailStream,
  fetchAnimeRecommendation$,
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
    window.scroll({ top: 0 });
    return () => {
      document.title = `My Anime Fun - Watch latest anime in high quality`;
      subscription2.unsubscribe();
    };
  };
};

export const fetchData = (
  malId,
  linkWatchingInputElement,
  setShowThemeMusic
) => {
  return () => {
    const fetchDataInfo$ = fetchData$(malId).pipe(
      tap((v) => {
        animeDetailStream.updateIsLoading(false, "isLoadingInfoAnime");
        animeDetailStream.updateData({
          dataInformationAnime: v,
        });
        if (
          (v.ending_themes && v.ending_themes.length > 3) ||
          (v.opening_themes && v.opening_themes.length > 3)
        ) {
          setShowThemeMusic(false);
        } else {
          setShowThemeMusic(true);
        }
        document.title =
          v.title || `My Anime Fun - Watch latest anime in high quality`;
      })
    );
    const fetchDataVideoPromo$ = fetchDataVideo$(malId).pipe(
      tap(({ promo }) => {
        if (promo) {
          animeDetailStream.updateData({
            dataVideoPromo: promo,
          });
        }
        animeDetailStream.updateIsLoading(false, "isLoadingVideoAnime");
      })
    );
    const fetchLargePictureUrl$ = fetchLargePicture$(malId).pipe(
      tap(({ pictures }) => {
        try {
          animeDetailStream.updateData({
            dataLargePictureList: pictures
              .map((picture) => picture.large)
              .reverse(),
            isLoadingLargePicture: false,
          });
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
        animeDetailStream.updateIsLoading(false, "isLoadingRelated");
        animeDetailStream.updateData({
          dataRelatedAnime: data,
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
    let subscription;
    if (animeDetailStream.currentState().malId !== malId) {
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
      animeDetailStream.resetState();
      subscription = from([
        fetchDataInfo$,
        fetchDataVideoPromo$,
        fetchLargePictureUrl$,
        fetchAnimeAppears$,
        fetchCharacters$,
      ])
        .pipe(combineAll())
        .subscribe(() => {
          characterStream.updateData({ page: 1 });
          animeDetailStream.updateData({
            malId: malId,
          });
        });
    }
    return () => {
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
  linkWatchingInputElement
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
      linkWatchingInputElement && (linkWatchingInputElement.value = "");
    };
  };
};
