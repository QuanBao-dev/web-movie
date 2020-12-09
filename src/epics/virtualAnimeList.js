import { fromEvent } from "rxjs";
import { debounceTime } from "rxjs/operators";
import virtualAnimeListStore from "../store/virtualAnimeList";

export const virtualAnimeListStream = virtualAnimeListStore;

export const resizedVirtual$ = () => {
  return fromEvent(window, "resize").pipe(debounceTime(500));
};

export const listenWindowScrollingFast$ = () => {
  return fromEvent(window, "scroll").pipe(debounceTime(200));
};
