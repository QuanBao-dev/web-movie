import { useEffect } from "react";
import { topAnimeListStream } from "../epics/topAnimeList";

import {
  fetchTopAnime,
  initTopAnimeList,
  pageScrollingUpdatePage,
} from "../Functions/topAnimeList";

export const useInitTopAnimeList = (setTopAnimeListState) => {
  useEffect(initTopAnimeList(setTopAnimeListState), []);
};

export const usePageScrollingUpdatePage = (topAnimeListState) => {
  useEffect(pageScrollingUpdatePage(), [
    topAnimeListState.allowFetchIncreasePageTopMovie,
    topAnimeListState.pageTopMovie,
    topAnimeListState.screenWidth,
  ]);
};

export const useFetchTopAnime = (
  topAnimeListState = topAnimeListStream.currentState()
) => {
  useEffect(fetchTopAnime(topAnimeListState), [
    topAnimeListState.pageTopMovie,
    topAnimeListState.toggleFetchMode,
  ]);
};
