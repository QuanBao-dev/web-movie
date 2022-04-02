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
  useEffect(genreIdChange(query, lazyLoadState.query), [lazyLoadState.query]);
};

export const useUpdatePageScrollingWindow = ({
  pageGenre,
  genreDetailData,
  isStopScrollingUpdated,
}) => {
  useEffect(
    updatePageScrollingWindow(genreDetailData, isStopScrollingUpdated),
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
  query,
  url
) => {
  useEffect(
    fetchDataGenreAnimeList(
      pageGenre,
      isStopScrollingUpdated,
      genreDetailData,
      query,
      url
    ),
    [pageGenre, query, currentGenreId]
  );
};
