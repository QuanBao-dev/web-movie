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
    [allowFetchIncreaseGenrePage, pageGenre]
  );
};

export const useFetchDataGenreAnimeList = (
  {
    pageGenre,
    isStopScrollingUpdated,
    genreDetailData,
  } = lazyLoadAnimeListStream.currentState(),
  genreId,
  url,
  virtual
) => {
  useEffect(
    fetchDataGenreAnimeList(
      pageGenre,
      isStopScrollingUpdated,
      genreDetailData,
      genreId,
      url,
      virtual
    ),
    [pageGenre, genreId]
  );
};
