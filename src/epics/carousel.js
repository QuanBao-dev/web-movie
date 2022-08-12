import { of, timer } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, filter, mergeMapTo, pluck } from 'rxjs/operators';

import carouselStore from '../store/carousel';

export const carouselStream = carouselStore;
export function fetchCarousel$() {
  return timer(0).pipe(
    filter(() => carouselStream.currentState().dataCarousel.length === 0),
    mergeMapTo(
      ajax("/api/movies/carousel").pipe(
        pluck("response", "message"),
        catchError((error) => of({ error }))
      )
    )
  );
}
