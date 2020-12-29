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
  malId
) => {
  useEffect(fetchData(malId, linkWatchingInputRef.current, setShowThemeMusic), [
    malId,
    linkWatchingInputRef.current,
  ]);
};

export const useFetchBoxMovieOneMovie = (
  { idCartoonUser },
  malId,
  addMovieRef,
  deleteMovieRef,
  linkWatchingInputRef
) => {
  useEffect(
    fetchBoxMovieOneMovie(
      malId,
      idCartoonUser,
      addMovieRef,
      deleteMovieRef,
      linkWatchingInputRef.current
    ),
    [idCartoonUser, malId, linkWatchingInputRef.current]
  );
};
