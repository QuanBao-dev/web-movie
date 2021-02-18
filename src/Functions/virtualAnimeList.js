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
      width: virtualAnimeListStream.currentState().offsetWidthAnime - 10,
      height: virtualAnimeListStream.currentState().offsetHeightAnime - 10,
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
      const screenWidth =
        document.querySelector(".container-genre-detail").offsetWidth + 1;
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
          virtualAnimeListStream.currentState().offsetWidthAnime -
        10
      }px`;
      const numberRow =
        lazyLoadAnimeListStream.currentState().genreDetailData.length /
        virtualAnimeListStream.currentState().quantityAnimePerRow;
      if (parseInt(numberRow) !== numberRow) {
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
      let width, height;
      if (virtualAnimeListStream.currentState().screenWidth > 1110) {
        width =
          document.querySelector(".container-genre-detail").offsetWidth / 5;
        height = (width * 340) / 224;
      } else if (virtualAnimeListStream.currentState().screenWidth > 900) {
        width =
          document.querySelector(".container-genre-detail").offsetWidth / 4;
        height = (width * 340) / 224;
      } else if (virtualAnimeListStream.currentState().screenWidth > 600) {
        width =
          document.querySelector(".container-genre-detail").offsetWidth / 3;
        height = (width * 340) / 224;
      } else {
        width =
          document.querySelector(".container-genre-detail").offsetWidth / 2;
        height = (width * 340) / 224;
      }

      if (width && height) {
        if (lazyLoadAnimeListStream.currentState().pageSplit === 1) {
          virtualAnimeListStream.updateData({
            quantityAnimePerRow: quantityAnimePerRow || 0,
            offsetWidthAnime: width,
            offsetHeightAnime: height,
          });
        } else {
          virtualAnimeListStream.updateDataQuick({
            quantityAnimePerRow: quantityAnimePerRow || 0,
            offsetWidthAnime: width,
            offsetHeightAnime: height,
          });
        }
      }
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
      scrollingSub && scrollingSub.unsubscribe();
      subscription && subscription.unsubscribe();
    };
  };
};
