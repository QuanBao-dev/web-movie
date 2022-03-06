import { useEffect } from "react";

import {
  fetchAnimeListSeason,
  filterAnimeList,
  initAnimeListSeason,
  listenWhenOptionChange,
} from "../Functions/animeListSeason";

export const useInitAnimeListSeason = (setAnimeListState) => {
  useEffect(initAnimeListSeason(setAnimeListState), []);
};

export const useFilterAnimeList = (animeListSeasonState) => {
  useEffect(filterAnimeList(animeListSeasonState), [
    animeListSeasonState.score,
    animeListSeasonState.modeFilter,
    animeListSeasonState.genreId,
  ]);
};

export const useFetchAnimeListSeason = (animeListSeasonState) => {
  useEffect(fetchAnimeListSeason(animeListSeasonState), [
    animeListSeasonState.year,
    animeListSeasonState.season,
    animeListSeasonState.numberOfProduct,
    animeListSeasonState.currentPage
  ]);
};

export const useListenWhenOptionChange = (
  animeListSeasonState,
  selectSeason,
  selectYear,
  selectScore,
  selectGenre
) => {
  useEffect(
    listenWhenOptionChange(
      animeListSeasonState,
      selectSeason,
      selectYear,
      selectScore,
      selectGenre
    ),
    [animeListSeasonState.screenWidth]
  );
};
