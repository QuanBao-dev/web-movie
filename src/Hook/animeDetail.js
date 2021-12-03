import { useEffect } from "react";
import {
  fetchBoxMovieOneMovie,
  fetchData,
  initAnimeDetailState,
} from "../Functions/animeDetail";

export const useInitAnimeDetailState = (setNameState) => {
  useEffect(initAnimeDetailState(setNameState), []);
};

export const useFetchData = (
  setShowThemeMusic,
  linkWatchingInputRef,
  malId,
  history
) => {
  useEffect(fetchData(malId, linkWatchingInputRef.current, setShowThemeMusic, history), [
    malId,
    linkWatchingInputRef.current,
  ]);
};

export const useFetchBoxMovieOneMovie = (
  { idCartoonUser },
  malId,
  addMovieRef,
  deleteMovieRef,
  isLoadingLargePicture
) => {
  useEffect(
    fetchBoxMovieOneMovie(
      malId,
      idCartoonUser,
      addMovieRef,
      deleteMovieRef,
    ),
    [idCartoonUser, malId, isLoadingLargePicture]
  );
};
