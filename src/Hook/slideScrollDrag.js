import { useEffect } from "react";
import { fromEvent } from "rxjs";
import { filter } from "rxjs/operators";
import { animeDetailStream } from "../epics/animeDetail";
import navBarStore from "../store/navbar";
const threshold = 100;
export const useMouseUpHandling = (
  isMouseDownRef,
  sliderImageContainerRef,
  sliderLargeImageRef,
  dataImageList,
  page,
  delta,
  setPage,
  posX1,
  posX2,
  isSmall
) => {
  useEffect(() => {
    const subscription = fromEvent(window, "mouseup")
      .pipe(
        filter(
          () =>
            isMouseDownRef.current &&
            !(
              isSmall &&
              animeDetailStream.currentState().dataLargePictureList.length <= 4
            )
        )
      )
      .subscribe(() => {
        isMouseDownRef.current = false;
        handleEndSlidingSmooth(
          isSmall,
          sliderLargeImageRef,
          dataImageList,
          delta,
          setPage,
          page,
          threshold
        );
        setTimeout(() => {
          if (
            sliderImageContainerRef &&
            sliderImageContainerRef.current.className.includes(" sliding")
          ) {
            sliderImageContainerRef.current.className =
              sliderImageContainerRef.current.className.replace(" sliding", "");
          }
        }, 300);
        posX1.current = 0;
        posX2.current = 0;
        delta.current = 0;
      });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataImageList.length, page, isSmall]);
};

export const useMouseMoveHandling = (
  isMouseDownRef,
  sliderImageContainerRef,
  posX1,
  posX2,
  delta,
  sliderLargeImageRef,
  dataImageList,
  page,
  isSmall
) => {
  useEffect(() => {
    const subscription = fromEvent(window, "mousemove")
      .pipe(
        filter(
          () =>
            !(
              isSmall &&
              animeDetailStream.currentState().dataLargePictureList.length <= 4
            )
        )
      )
      .subscribe((e) => {
        if (isMouseDownRef.current === true) {
          if (
            sliderImageContainerRef &&
            !sliderImageContainerRef.current.className.includes(" sliding")
          ) {
            sliderImageContainerRef.current.className += " sliding";
          }
          handleMoveSlidingSmooth(
            false,
            posX2,
            posX1,
            e,
            delta,
            sliderLargeImageRef,
            isSmall,
            dataImageList,
            page,
            threshold
          );
        }
      });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataImageList.length, page, isSmall]);
};
export const useTouchEndHandling = (
  sliderLargeImageRef,
  isSmall,
  dataImageList,
  page,
  delta,
  posX1,
  posX2,
  setPage,
  setAllowSliding
) => {
  useEffect(() => {
    const subscription = fromEvent(sliderLargeImageRef.current, "touchend")
      .pipe(
        filter(
          () =>
            !(
              isSmall &&
              animeDetailStream.currentState().dataLargePictureList.length <= 4
            )
        )
      )
      .subscribe(() => {
        handleEndSlidingSmooth(
          isSmall,
          sliderLargeImageRef,
          dataImageList,
          delta,
          setPage,
          page,
          threshold
        );
        if (navBarStore.currentState().isMobile)
          setTimeout(() => {
            setAllowSliding(true);
          }, 500);
        posX1.current = 0;
        posX2.current = 0;
        delta.current = 0;
      });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataImageList.length, isSmall, page]);
};

export const useTouchMoveHandling = (
  sliderLargeImageRef,
  posX2,
  posX1,
  delta,
  isSmall,
  dataImageList,
  page,
  allowSliding
) => {
  useEffect(() => {
    const subscription = fromEvent(sliderLargeImageRef.current, "touchmove")
      .pipe(
        filter(
          () =>
            allowSliding === true &&
            !(
              isSmall &&
              animeDetailStream.currentState().dataLargePictureList.length <= 4
            )
        )
      )
      .subscribe((e) => {
        handleMoveSlidingSmooth(
          true,
          posX2,
          posX1,
          e,
          delta,
          sliderLargeImageRef,
          isSmall,
          dataImageList,
          page,
          threshold
        );
      });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataImageList.length, isSmall, page, allowSliding]);
};

function handleMoveSlidingSmooth(
  isMobile,
  posX2,
  posX1,
  e,
  delta,
  sliderLargeImageRef,
  isSmall,
  dataImageList,
  page,
  threshold
) {
  if (!isMobile) posX2.current = posX1.current - e.clientX;
  else posX2.current = posX1.current - e.touches[0].clientX;
  if (posX1.current !== 0) {
    delta.current += posX2.current;
    sliderLargeImageRef.current.style.transition = "0s";
    let currentOffsetLeft;
    if (!isSmall)
      currentOffsetLeft =
        sliderLargeImageRef.current.offsetWidth *
          ((1 / (dataImageList.length + 2)) * (page + 1)) +
        delta.current;
    else
      currentOffsetLeft =
        (sliderLargeImageRef.current.offsetWidth *
          (page < dataImageList.length - 4
            ? page * 25
            : (dataImageList.length - 4) * 25)) /
          100 +
        delta.current;
    if (isSmall) {
      sliderLargeImageRef.current.style.transform = `translateX(-${currentOffsetLeft}px)`;
    }
    if (!isSmall) {
      const maxWidthThreshold =
        (sliderLargeImageRef.current.offsetWidth / (dataImageList.length + 2)) *
        dataImageList.length;
      const minWidthThreshold =
        sliderLargeImageRef.current.offsetWidth / (dataImageList.length + 2);
      if (
        currentOffsetLeft >= minWidthThreshold - threshold &&
        currentOffsetLeft <= maxWidthThreshold + threshold
      )
        sliderLargeImageRef.current.style.transform = `translateX(-${currentOffsetLeft}px)`;
      else if (currentOffsetLeft > maxWidthThreshold + threshold)
        sliderLargeImageRef.current.style.transform = `translateX(-${
          currentOffsetLeft - maxWidthThreshold
        }px)`;
      else if (currentOffsetLeft < minWidthThreshold - threshold)
        sliderLargeImageRef.current.style.transform = `translateX(-${
          maxWidthThreshold + currentOffsetLeft
        }px)`;
    }
  }
  if (!isMobile) posX1.current = e.clientX;
  else posX1.current = e.touches[0].clientX;
}
function handleEndSlidingSmooth(
  isSmall,
  sliderLargeImageRef,
  dataImageList,
  delta,
  setPage,
  page,
  threshold
) {
  sliderLargeImageRef.current.style.transition = "0.5s";
  let currentOffsetLeft, widthEachItem;
  if (!isSmall) {
    currentOffsetLeft = parseInt(
      sliderLargeImageRef.current.style.transform.match(/[0-9]+/g)[0]
    );
    widthEachItem =
      sliderLargeImageRef.current.offsetWidth / (dataImageList.length + 2);
    if (delta.current > 0) {
      const isNextPage =
        (currentOffsetLeft / widthEachItem -
          parseInt(currentOffsetLeft / widthEachItem)) *
          widthEachItem >
        threshold;
      if (isNextPage) {
        setPage(parseInt(currentOffsetLeft / widthEachItem));
      } else {
        if (parseInt(currentOffsetLeft / widthEachItem) - 1 !== page) {
          setPage(parseInt(currentOffsetLeft / widthEachItem) - 1);
        } else {
          sliderLargeImageRef.current.style.transform = `translateX(-${
            currentOffsetLeft - delta.current
          }px)`;
        }
      }
    }

    if (delta.current < 0) {
      const isNextPage =
        (1 -
          (currentOffsetLeft / widthEachItem -
            parseInt(currentOffsetLeft / widthEachItem))) *
          widthEachItem >
        threshold;
      if (isNextPage) {
        setPage(parseInt(currentOffsetLeft / widthEachItem) - 1);
      } else {
        if (parseInt(currentOffsetLeft / widthEachItem) !== page) {
          setPage(parseInt(currentOffsetLeft / widthEachItem));
        } else {
          sliderLargeImageRef.current.style.transform = `translateX(-${
            currentOffsetLeft - delta.current
          }px)`;
        }
      }
    }
  } else {
    currentOffsetLeft =
      (sliderLargeImageRef.current.offsetWidth *
        (page < dataImageList.length - 4
          ? page * 25
          : (dataImageList.length - 4) * 25)) /
        100 +
      delta.current;
    widthEachItem = (sliderLargeImageRef.current.offsetWidth * 1) / 4;
    if (
      Math.round(currentOffsetLeft / widthEachItem) <
      dataImageList.length - 4
    ) {
      const page =
        Math.round(currentOffsetLeft / widthEachItem) < 0
          ? 0
          : Math.round(currentOffsetLeft / widthEachItem);
      setPage(page);
      sliderLargeImageRef.current.style.transform = `translateX(-${
        page * 25
      }%)`;
    }
    if (
      Math.round(currentOffsetLeft / widthEachItem) >=
      dataImageList.length - 4
    ) {
      setPage(dataImageList.length - 4);
      sliderLargeImageRef.current.style.transform = `translateX(-${
        (dataImageList.length - 4) * 25
      }%)`;
    }
  }
}
