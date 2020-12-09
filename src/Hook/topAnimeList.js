import { useEffect } from 'react';

import { fetchTopAnime, initTopAnimeList, pageScrollingUpdatePage } from '../Functions/topAnimeList';

export const useInitTopAnimeList = (setTopAnimeListState) => {
  useEffect(initTopAnimeList(setTopAnimeListState), []);
};

export const usePageScrollingUpdatePage = (topAnimeListState) => {
  useEffect(pageScrollingUpdatePage(), [
    topAnimeListState.allowFetchIncreasePageTopMovie,
    topAnimeListState.pageTopMovie,
    topAnimeListState.screenWidth,
  ]);
}

export const useFetchTopAnime = (topAnimeListState) => {
  useEffect(fetchTopAnime(topAnimeListState), [topAnimeListState.pageTopMovie]);
}