import { of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { catchError, filter, pluck } from "rxjs/operators";

import carouselStore from "../store/carousel";

export const carouselStream = carouselStore;
export function fetchCarousel$() {
  return ajax("/api/movies/carousel").pipe(
    filter(() => carouselStream.currentState().dataCarousel.length === 0),
    pluck("response", "message"),
    catchError((error) => of({ error }))
  );
}
