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
    upcomingAnimeListStream.updateData({ screenWidth: window.innerWidth });
    const elementScroll = document.querySelector(".list-anime-nowrap");
    elementScroll.style.transform = `translateX(${
      upcomingAnimeListStream.currentState().offsetLeft
    }px)`;
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
    let subscription2,
      subscriptionMouseEnter,
      subscriptionMouseLeave,
      subscriptionMouseMove,
      subscriptionMouseUp,
      subscriptionMouseDown;
    let subscriptionTouchStart, subscriptionTouchMove, subscriptionTouchEnd;
    if (length !== 0) {
      if (elementScroll) {
        const end = length - 7;
        subscriptionTouchStart = fromEvent(
          elementScroll,
          "touchstart"
        ).subscribe((e) => {
          upcomingAnimeListStream.updateDataQuick({
            mouseStartX: e.touches[0].clientX,
          });
        });
        subscriptionTouchMove = fromEvent(elementScroll, "touchmove").subscribe(
          (e) => {
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
                upcomingAnimeListStream.currentState().offsetLeft + delta * 0.1;
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
                  .childNodes[numberList].offsetLeft}px)`;
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
                }px)`;
              }
            }
          }
        );
        subscriptionTouchEnd = fromEvent(elementScroll, "touchend").subscribe(
          () => {
            // stream.updateMouseStartX(null);
            delta = 0;
            posX1 = 0;
            posX2 = 0;
            upcomingAnimeListStream.updateDataQuick({
              mouseStartX: null,
            });
          }
        );
        subscriptionMouseMove = fromEvent(elementScroll, "mousemove").subscribe(
          (e) => {
            if (upcomingAnimeListStream.currentState().mouseStartX) {
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
              if (delta !== 0) {
                upcomingAnimeListStream.updateDataQuick({
                  isScrolling: true,
                });
              }
              const offsetLeft =
                upcomingAnimeListStream.currentState().offsetLeft + delta * 0.05;
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
                }px)`;
              }
            }
          }
        );
        subscriptionMouseUp = fromEvent(window, "mouseup").subscribe(() => {
          if (upcomingAnimeListStream.currentState().isScrolling === true)
            upcomingAnimeListStream.updateData({
              isScrolling: false,
            });
          delta = 0;
          posX1 = 0;
          posX2 = 0;
          upcomingAnimeListStream.updateDataQuick({ mouseStartX: null });
        });
        subscriptionMouseEnter = fromEvent(
          elementScroll,
          "mouseenter"
        ).subscribe(() => {
          upcomingAnimeListStream.updateDataQuick({
            modeScrolling: "enter",
          });
        });
        subscriptionMouseLeave = fromEvent(
          elementScroll,
          "mouseleave"
        ).subscribe(() => {
          delta = 0;
          posX1 = 0;
          posX2 = 0;
          upcomingAnimeListStream.updateDataQuick({
            mouseStartX: null,
            modeScrolling: "interval",
          });
        });
        subscriptionMouseDown = fromEvent(elementScroll, "mousedown").subscribe(
          (e) => {
            e.preventDefault();
            // stream.updateMouseStartX(e.clientX);
            upcomingAnimeListStream.updateDataQuick({
              mouseStartX: e.clientX,
              isScrolling: false,
            });
          }
        );
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
          }px)`;
        });
      }
    }
    return () => {
      subscription2 && subscription2.unsubscribe();
      subscriptionMouseEnter && subscriptionMouseEnter.unsubscribe();
      subscriptionMouseLeave && subscriptionMouseLeave.unsubscribe();
      subscriptionMouseUp && subscriptionMouseUp.unsubscribe();
      subscriptionMouseMove && subscriptionMouseMove.unsubscribe();
      subscriptionMouseDown && subscriptionMouseDown.unsubscribe();
      subscriptionTouchStart && subscriptionTouchStart.unsubscribe();
      subscriptionTouchMove && subscriptionTouchMove.unsubscribe();
      subscriptionTouchEnd && subscriptionTouchEnd.unsubscribe();
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
