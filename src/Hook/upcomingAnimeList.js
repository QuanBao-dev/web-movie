import { useEffect } from "react";
import {
  fetchUpcomingAnimeList,
  keepDragMoveAnimeList,
  initUpcomingAnimeList,
} from "../Functions/upcomingAnimeList";

export const useInitUpcomingAnimeList = (setUpcomingAnimeListState) => {
  useEffect(initUpcomingAnimeList(setUpcomingAnimeListState), []);
};

export const useKeepDragMoveAnimeList = (length, numberList) => {
  const elementScroll = document.querySelector(".list-anime-nowrap");
  useEffect(keepDragMoveAnimeList(elementScroll, length, numberList), [
    length,
    elementScroll,
  ]);
};

export const useFetchUpcomingAnimeList = (numberList, numberCloneList) => {
  useEffect(fetchUpcomingAnimeList(numberList, numberCloneList), []);
};
