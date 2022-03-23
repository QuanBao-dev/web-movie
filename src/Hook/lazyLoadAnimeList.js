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

export const useGenreIdChange = (genreId, { currentGenreId }) => {
  useEffect(genreIdChange(genreId, currentGenreId), [currentGenreId]);
};

export const useUpdatePageScrollingWindow = (
  {
    pageGenre,
    genreDetailData,
    isStopScrollingUpdated,
  }
) => {
  useEffect(
    updatePageScrollingWindow(
      genreDetailData,
      isStopScrollingUpdated
    ),
    [genreDetailData.length, pageGenre]
  );
};

export const useFetchDataGenreAnimeList = (
  {
    pageGenre,
    isStopScrollingUpdated,
    genreDetailData,
    currentGenreId,
  } = lazyLoadAnimeListStream.currentState(),
  genreId,
  url,
  type
) => {
  useEffect(
    fetchDataGenreAnimeList(
      pageGenre,
      isStopScrollingUpdated,
      genreDetailData,
      genreId,
      url,
      type
    ),
    [pageGenre, genreId, currentGenreId]
  );
};
