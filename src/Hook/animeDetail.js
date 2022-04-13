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
  history,
  type
) => {
  useEffect(
    fetchData(
      malId,
      linkWatchingInputRef.current,
      setShowThemeMusic,
      history,
      type
    ),
    [malId, linkWatchingInputRef.current]
  );
};

export const useFetchBoxMovieOneMovie = (
  { idCartoonUser },
  malId,
  addMovieRef,
  deleteMovieRef,
  isAddMode,
  triggerFetch
) => {
  useEffect(
    fetchBoxMovieOneMovie(
      malId,
      idCartoonUser,
      addMovieRef,
      deleteMovieRef,
      isAddMode
    ),
    [idCartoonUser, malId, isAddMode, triggerFetch]
  );
};
