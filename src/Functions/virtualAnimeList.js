import { fromEvent } from "rxjs";
import { lazyLoadAnimeListStream } from "../epics/lazyLoadAnimeList";

import {
  listenWindowScrollingFast$,
  virtualAnimeListStream,
} from "../epics/virtualAnimeList";

export const initVirtualAnimeList = (setVirtualAnimeListState) => {
  return () => {
    let subscription;
    subscription = virtualAnimeListStream.subscribe(setVirtualAnimeListState);
    virtualAnimeListStream.init();
    return () => {
      subscription && subscription.unsubscribe();
    };
  };
};

export function updateVirtualStyle(virtual, index) {
  let virtualStyle;
  if (virtual)
    virtualStyle = {
      position: "absolute",
      top:
        parseInt(
          index / virtualAnimeListStream.currentState().quantityAnimePerRow
        ) * virtualAnimeListStream.currentState().offsetHeightAnime || 0,
      left:
        parseInt(
          index % virtualAnimeListStream.currentState().quantityAnimePerRow
        ) * virtualAnimeListStream.currentState().offsetWidthAnime || 0,
    };
  else virtualStyle = {};
  return virtualStyle;
}

export const updateVirtualAnimeList = (virtual, data) => {
  return () => {
    if (virtual) {
      const listAnimeE = document.querySelector(
        ".container-genre-detail .list-anime"
      );
      const screenWidth = document.querySelector(".container-genre-detail")
        .offsetWidth;
      virtualAnimeListStream.updateData({
        screenHeight:
          (data.length /
            virtualAnimeListStream.currentState().quantityAnimePerRow -
            1) *
            virtualAnimeListStream.currentState().offsetHeightAnime || 0,
        screenWidth: screenWidth || 0,
      });
      listAnimeE.style.width = `${
        virtualAnimeListStream.currentState().quantityAnimePerRow *
        virtualAnimeListStream.currentState().offsetWidthAnime
      }px`;
      if (lazyLoadAnimeListStream.currentState().genreDetailData.length < 10) {
        listAnimeE.style.height = `${
          virtualAnimeListStream.currentState().screenHeight +
          virtualAnimeListStream.currentState().offsetHeightAnime +
          virtualAnimeListStream.currentState().offsetHeightAnime / 1.5
        }px`;
      } else {
        listAnimeE.style.height = `${
          virtualAnimeListStream.currentState().screenHeight +
          virtualAnimeListStream.currentState().offsetHeightAnime
        }px`;
      }
    }
  };
};

export const updateVirtualAnimeItem = (animeItemRef, virtual) => {
  return () => {
    if (animeItemRef.current && virtual) {
      const quantityAnimePerRow = parseInt(
        virtualAnimeListStream.currentState().screenWidth /
          virtualAnimeListStream.currentState().offsetWidthAnime
      );
      const margin = window.innerWidth < 365 ? 10 : 20;
      virtualAnimeListStream.updateDataQuick({ margin });
      if (
        quantityAnimePerRow !==
        virtualAnimeListStream.currentState().quantityAnimePerRow
      )
        virtualAnimeListStream.updateData({
          quantityAnimePerRow: quantityAnimePerRow || 0,
          offsetWidthAnime: animeItemRef.current.offsetWidth + margin,
          offsetHeightAnime: animeItemRef.current.offsetHeight + margin,
        });
    }
  };
};

export const virtualizeListAnime = (virtual, listAnimeElement) => {
  return () => {
    let subscription, scrollingSub;
    if (virtual && listAnimeElement) {
      scrollingSub = listenWindowScrollingFast$().subscribe(() => {
        const { offsetHeightAnime } = virtualAnimeListStream.currentState();
        const firstElement = document.querySelector(".anime-item");
        const listAnimeElement = [...document.querySelectorAll(".anime-item")];
        const lastElement = listAnimeElement[listAnimeElement.length - 1];
        if (
          firstElement &&
          (firstElement.offsetTop > window.scrollY ||
            (lastElement &&
              lastElement.offsetTop + offsetHeightAnime < window.scrollY))
        ) {
          document.querySelector(".anime-item").scrollIntoView();
        }
      });
      subscription = fromEvent(window, "scroll").subscribe(() => {
        if (
          document.querySelector(".anime-item") &&
          document.querySelector(".anime-item").getBoundingClientRect().top > 0
        ) {
          // console.log(document.querySelector(".anime-item"), "show");
          virtualAnimeListStream.updateData({
            numberShowMorePreviousAnime:
              window.scrollY > 485
                ? virtualAnimeListStream.currentState()
                    .numberShowMorePreviousAnime + 1
                : virtualAnimeListStream.currentState()
                    .numberShowMorePreviousAnime,
            numberShowMoreLaterAnime: 1,
          });
        }
        const { numberAnimeShowMore } = lazyLoadAnimeListStream.currentState();
        const lastElement =
          listAnimeElement.childNodes[2 * numberAnimeShowMore - 1];
        if (
          lastElement &&
          lastElement.getBoundingClientRect().top +
            lastElement.getBoundingClientRect().height -
            window.innerHeight <
            0
        ) {
          // console.log(lastElement, "show Later");
          if (
            virtualAnimeListStream.currentState().numberShowMorePreviousAnime -
              1 >
            0
          ) {
            virtualAnimeListStream.updateData({
              numberShowMorePreviousAnime:
                virtualAnimeListStream.currentState()
                  .numberShowMorePreviousAnime - 1,
            });
          } else {
            virtualAnimeListStream.updateData({
              numberShowMoreLaterAnime:
                virtualAnimeListStream.currentState().numberShowMoreLaterAnime +
                1,
              numberShowMorePreviousAnime:
                virtualAnimeListStream.currentState()
                  .numberShowMorePreviousAnime - 1,
            });
          }
        }
      });
    }
    return () => {
      console.log("out");
      scrollingSub && scrollingSub.unsubscribe();
      subscription && subscription.unsubscribe();
    };
  };
};
