import { useEffect } from "react";
import { lazyLoadAnimeListStream } from "../epics/lazyLoadAnimeList";

import {
  genreIdChange,
  initLazyLoadAnimeList,
  updatePageScrollingWindow,
  fetchDataGenreAnimeList,
} from "../Functions/lazyLoadAnimeList";

export const useInitLazyLoadAnimeList = (setLazyLoadState) => {
  useEffect(initLazyLoadAnimeList(setLazyLoadState), []);
};

export const useGenreIdChange = (query, lazyLoadState) => {
  useEffect(genreIdChange(query, lazyLoadState.query), [
    query,
    lazyLoadState.query,
  ]);
};

export const useUpdatePageScrollingWindow = (isStopScrollingUpdated) => {
  useEffect(updatePageScrollingWindow(isStopScrollingUpdated), [
    isStopScrollingUpdated,
  ]);
};

export const useFetchDataGenreAnimeList = (
  {
    pageGenre,
    isStopScrollingUpdated,
    genreDetailData,
    currentGenreId,
    trigger
  } = lazyLoadAnimeListStream.currentState(),
  query,
  url,
  searchBy,
  idCartoonUser
) => {
  useEffect(
    fetchDataGenreAnimeList(
      pageGenre,
      isStopScrollingUpdated,
      genreDetailData,
      query,
      url,
      searchBy,
      idCartoonUser
    ),
    [pageGenre, query, currentGenreId, trigger]
  );
};
