import { useEffect } from "react";

import {
  initVirtualAnimeList,
  updateVirtualAnimeItem,
  updateVirtualAnimeList,
  virtualizeListAnime,
} from "../Functions/virtualAnimeList";

export const useInitVirtualAnimeList = (setVirtualAnimeListState) => {
  useEffect(initVirtualAnimeList(setVirtualAnimeListState), []);
};

export const useUpdateVirtualAnimeList = (
  virtual,
  data,
  { screenWidth, quantityAnimePerRow }
) => {
  useEffect(updateVirtualAnimeList(virtual, data), [
    data.length,
    virtual,
    screenWidth,
    quantityAnimePerRow,
  ]);
};

export const useUpdateVirtualAnimeItem = (
  animeItemRef,
  virtual,
  { screenWidth }
) => {
  useEffect(updateVirtualAnimeItem(animeItemRef, virtual), [
    virtual,
    animeItemRef.current,
    screenWidth,
  ]);
};

export const useVirtualizeListAnime = (
  virtual,
  listAnimeRef,
) => {
  useEffect(virtualizeListAnime(virtual, listAnimeRef.current), [
    virtual,
    listAnimeRef.current,
  ]);
};
