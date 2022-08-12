import { asyncScheduler, interval, of, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  filter,
  pluck,
  retry,
  switchMap,
  takeWhile,
  tap,
  throttleTime,
} from "rxjs/operators";

import upcomingAnimeListStore from "../store/upcomingAnimeList";

export const upcomingAnimeListStream = upcomingAnimeListStore;

export const scrollAnimeUser$ = (
  distance,
  elementScroll,
  forward,
  numberList
) => {
  let deltaDistance = 0;
  let end = upcomingAnimeListStream.currentState().upcomingAnimeList.length - 7;
  return timer(0, 2).pipe(
    takeWhile(() => deltaDistance < distance),
    tap(() => {
      upcomingAnimeListStream.updateDataQuick({ modeScrolling: "enter" });
      upcomingAnimeListStream.updateDataQuick({ shouldScrollLeft: false });
      deltaDistance += 10;
      let check = true;
      const offsetLeft =
        upcomingAnimeListStream.currentState().offsetLeft -
        deltaDistance * forward;
      if (
        elementScroll.childNodes[end] &&
        Math.abs(offsetLeft) >= elementScroll.childNodes[end].offsetLeft
      ) {
        upcomingAnimeListStream.updateDataQuick({
          offsetLeft: -elementScroll.childNodes[end - numberList].offsetLeft,
        });
        elementScroll.style.transition = "0s";
        elementScroll.style.transform = `translateX(${
          upcomingAnimeListStream.currentState().offsetLeft
        })`;
        check = false;
      }
      if (
        elementScroll.childNodes[0] &&
        offsetLeft - elementScroll.childNodes[0].offsetLeft > 0
      ) {
        console.log("reset");
        // stream.updateOffsetLeft(
        //   -elementScroll.childNodes[numberList].offsetLeft
        // );
        upcomingAnimeListStream.updateDataQuick({
          offsetLeft: -elementScroll.childNodes[numberList].offsetLeft,
        });
        elementScroll.style.transition = "0s";
        elementScroll.style.transform = `translateX(${
          upcomingAnimeListStream.currentState().offsetLeft
        })`;
        check = false;
      }
      if (check)
        elementScroll.style.transform = `translateX(${
          upcomingAnimeListStream.currentState().offsetLeft -
          deltaDistance * forward
        }px)`;
    }),
    filter(() => deltaDistance >= distance),
    tap(() => {
      upcomingAnimeListStream.updateDataQuick({
        offsetLeft:
          upcomingAnimeListStream.currentState().offsetLeft -
          deltaDistance * forward,
      });
      upcomingAnimeListStream.updateDataQuick({
        shouldScrollLeft: true,
        modeScrolling: "interval",
      });
    })
  );
};

export const scrollAnimeInterval$ = (scrollE, end) => {
  return interval(20).pipe(
    filter(
      () => upcomingAnimeListStream.currentState().modeScrolling === "interval"
    ),
    tap(() => {
      const offsetLeft =
        upcomingAnimeListStream.currentState().offsetLeft - 2.4;
      upcomingAnimeListStream.updateDataQuick({ offsetLeft });
      scrollE.style.transform = `translateX(${offsetLeft}px)`;
    }),
    filter(
      () =>
        scrollE.childNodes[end] &&
        Math.abs(upcomingAnimeListStream.currentState().offsetLeft) >=
          scrollE.childNodes[end].offsetLeft
    ),
    throttleTime(1000, asyncScheduler, {
      leading: true,
      trailing: false,
    })
  );
};

export const upcomingAnimeListUpdated$ = () => {
  return timer(0).pipe(
    filter(
      () =>
        upcomingAnimeListStream.currentState().upcomingAnimeList.length === 0
    ),
    switchMap(() =>
      ajax({
        url: `https://api.jikan.moe/v4/anime?status=upcoming&order_by=favorites&sort=desc`,
      }).pipe(
        pluck("response", "data"),
        retry(),
        catchError(() => of([]))
      )
    )
  );
};
