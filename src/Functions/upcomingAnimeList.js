import { fromEvent } from "rxjs";

import { stream } from "../epics/home";
import {
  scrollAnimeInterval$,
  upcomingAnimeListStream,
  upcomingAnimeListUpdated$,
} from "../epics/upcomingAnimeList";

export const initUpcomingAnimeList = (setUpcomingAnimeListState) => {
  return () => {
    const subscription = upcomingAnimeListStream.subscribe(
      setUpcomingAnimeListState
    );
    upcomingAnimeListStream.init();
    return () => {
      subscription.unsubscribe();
    };
  };
};

let posX1 = 0;
let posX2 = 0;
let delta = 0;
let isLeft = false;
export const keepDragMoveAnimeList = (elementScroll, length, numberList) => {
  return () => {
    let subscription2;
    if (length !== 0) {
      if (elementScroll) {
        const end = length - 7;
        fromEvent(elementScroll, "touchstart").subscribe((e) => {
          // stream.updateHasMoved(false);
          // stream.updateMouseStartX(e.touches[0].clientX);
          upcomingAnimeListStream.updateDataQuick({
            hasMoved: false,
            mouseStartX: e.touches[0].clientX,
          });
        });
        fromEvent(elementScroll, "touchmove").subscribe((e) => {
          // stream.updateHasMoved(false);
          upcomingAnimeListStream.updateDataQuick({
            hasMoved: false,
          });
          if (upcomingAnimeListStream.currentState().mouseStartX) {
            posX2 = posX1 - e.touches[0].clientX;
            if (posX2 < 0) {
              if (isLeft === false) {
                delta = 0;
                posX1 = 0;
                posX2 = 0;
              }
              isLeft = true;
            } else {
              if (isLeft === true) {
                delta = 0;
                posX1 = 0;
                posX2 = 0;
              }
              isLeft = false;
            }
            if (posX1 !== 0) {
              delta -= posX2;
            }
            posX1 = e.touches[0].clientX;
            const offsetLeft =
              upcomingAnimeListStream.currentState().offsetLeft + delta * 0.5;
            elementScroll.style.transform = `translateX(${offsetLeft}px)`;
            // stream.updateOffsetLeft(offsetLeft);
            upcomingAnimeListStream.updateDataQuick({
              offsetLeft,
            });
            if (
              elementScroll.childNodes[0] &&
              offsetLeft - elementScroll.childNodes[0].offsetLeft > 0
            ) {
              upcomingAnimeListStream.updateDataQuick({
                offsetLeft: -elementScroll.childNodes[numberList].offsetLeft,
              });
              elementScroll.style.transition = "0s";
              elementScroll.style.transform = `translateX(${-elementScroll
                .childNodes[numberList].offsetLeft})`;
            }

            if (
              elementScroll.childNodes[end] &&
              Math.abs(offsetLeft) >= elementScroll.childNodes[end].offsetLeft
            ) {
              upcomingAnimeListStream.updateDataQuick({
                offsetLeft: -elementScroll.childNodes[end - numberList]
                  .offsetLeft,
              });
              elementScroll.style.transition = "0s";
              elementScroll.style.transform = `translateX(${
                upcomingAnimeListStream.currentState().offsetLeft
              })`;
            }
          }
        });
        fromEvent(elementScroll, "touchend").subscribe(() => {
          // stream.updateMouseStartX(null);
          delta = 0;
          posX1 = 0;
          posX2 = 0;
          upcomingAnimeListStream.updateDataQuick({
            mouseStartX: null,
          });
        });

        fromEvent(elementScroll, "mousedown").subscribe((e) => {
          e.preventDefault();
          // stream.updateMouseStartX(e.clientX);
          upcomingAnimeListStream.updateDataQuick({
            mouseStartX: e.clientX,
          });
        });
        fromEvent(elementScroll, "mousemove").subscribe((e) => {
          if (upcomingAnimeListStream.currentState().mouseStartX) {
            upcomingAnimeListStream.updateDataQuick({
              hasMoved: true,
            });
            posX2 = posX1 - e.clientX;

            if (posX2 < 0) {
              if (isLeft === false) {
                delta = 0;
                posX1 = 0;
                posX2 = 0;
              }
              isLeft = true;
            } else {
              if (isLeft === true) {
                delta = 0;
                posX1 = 0;
                posX2 = 0;
              }
              isLeft = false;
            }
            if (posX1 !== 0) {
              delta -= posX2;
            }
            posX1 = e.clientX;
            const offsetLeft =
              upcomingAnimeListStream.currentState().offsetLeft + delta * 0.2;
            elementScroll.style.transform = `translateX(${offsetLeft}px)`;
            upcomingAnimeListStream.updateDataQuick({ offsetLeft });
            if (
              elementScroll.childNodes[0] &&
              offsetLeft - elementScroll.childNodes[0].offsetLeft > 0
            ) {
              upcomingAnimeListStream.updateDataQuick({
                offsetLeft: -elementScroll.childNodes[numberList].offsetLeft,
              });
              elementScroll.style.transition = "0s";
              elementScroll.style.transform = `translateX(${-elementScroll
                .childNodes[numberList].offsetLeft})`;
            }

            if (
              elementScroll.childNodes[end] &&
              Math.abs(offsetLeft) >= elementScroll.childNodes[end].offsetLeft
            ) {
              upcomingAnimeListStream.updateDataQuick({
                offsetLeft: -elementScroll.childNodes[end - numberList]
                  .offsetLeft,
              });
              elementScroll.style.transition = "0s";
              elementScroll.style.transform = `translateX(${
                upcomingAnimeListStream.currentState().offsetLeft
              })`;
            }
          }
        });
        fromEvent(elementScroll, "mouseup").subscribe(() => {
          // stream.updateMouseStartX(null);
          delta = 0;
          posX1 = 0;
          posX2 = 0;
          upcomingAnimeListStream.updateDataQuick({
            mouseStartX: null,
          });
        });
        fromEvent(elementScroll, "mouseleave").subscribe(() => {
          // stream.updateMouseStartX(null);
          // stream.updateHasMoved(false);
          delta = 0;
          posX1 = 0;
          posX2 = 0;
          upcomingAnimeListStream.updateDataQuick({
            mouseStartX: null,
            hasMoved: false,
          });
        });

        subscription2 = scrollAnimeInterval$(
          elementScroll,
          end,
          numberList
        ).subscribe(() => {
          upcomingAnimeListStream.updateDataQuick({
            offsetLeft: -elementScroll.childNodes[end - numberList].offsetLeft,
          });
          elementScroll.style.transition = "0s";
          elementScroll.style.transform = `translateX(${
            upcomingAnimeListStream.currentState().offsetLeft
          })`;
        });
      }
    }
    return () => {
      subscription2 && subscription2.unsubscribe();
    };
  };
};

export const fetchUpcomingAnimeList = (numberList, numberCloneList) => {
  return () => {
    const subscription = upcomingAnimeListUpdated$().subscribe((data) => {
      upcomingAnimeListStream.updateData({
        upcomingAnimeList: [
          ...data.slice(0, numberList),
          ...data.slice(0, numberCloneList),
        ],
      });
    });
    return () => {
      // updateModeScrolling("interval");
      upcomingAnimeListStream.updateDataQuick({
        modeScrolling: "interval",
      });
      subscription && subscription.unsubscribe();
      stream.updateData({
        isFirstLaunch: false,
      });
    };
  };
};
