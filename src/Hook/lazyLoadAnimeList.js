import { useEffect } from "react";
import { lazyLoadAnimeListStream } from "../epics/lazyLoadAnimeList";

import {
  genreIdChange,
  initLazyLoadAnimeList,
  updatePageScrollingWindow,
  fetchDataGenreAnimeList,
} from "../Functions/lazyLoadAnimeList";

export const useInitLazyLoadAnimeList = (virtual, setLazyLoadState) => {
  useEffect(initLazyLoadAnimeList(virtual, setLazyLoadState), []);
};

export const useGenreIdChange = (genreId, virtual, { currentGenreId }) => {
  useEffect(genreIdChange(genreId, virtual, currentGenreId), [currentGenreId]);
};

export const useUpdatePageScrollingWindow = (
  virtual,
  {
    allowFetchIncreaseGenrePage,
    pageGenre,
    genreDetailData,
    isStopScrollingUpdated,
  }
) => {
  useEffect(
    updatePageScrollingWindow(
      virtual,
      allowFetchIncreaseGenrePage,
      genreDetailData,
      isStopScrollingUpdated
    ),
    [genreDetailData.length, allowFetchIncreaseGenrePage, pageGenre]
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
  virtual,
  type
) => {
  useEffect(
    fetchDataGenreAnimeList(
      pageGenre,
      isStopScrollingUpdated,
      genreDetailData,
      genreId,
      url,
      virtual,
      type
    ),
    [pageGenre, genreId, currentGenreId]
  );
};
