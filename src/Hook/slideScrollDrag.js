import { useEffect } from "react";
import { fromEvent } from "rxjs";
import { filter } from "rxjs/operators";

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
      .pipe(filter(() => isMouseDownRef.current))
      .subscribe(() => {
        isMouseDownRef.current = false;
        sliderLargeImageRef.current.style.transition = "0.5s";
        if (true) {
          let currentOffsetLeft;
          if (!isSmall)
            currentOffsetLeft =
              sliderLargeImageRef.current.offsetWidth *
                ((1 / dataImageList.length) * page) +
              delta.current;
          else
            currentOffsetLeft =
              (sliderLargeImageRef.current.offsetWidth *
                (page < dataImageList.length - 4
                  ? page * 25
                  : (dataImageList.length - 4) * 25)) /
                100 +
              delta.current;
          let widthEachItem;
          if (!isSmall)
            widthEachItem =
              sliderLargeImageRef.current.offsetWidth / dataImageList.length;
          else
            widthEachItem = (sliderLargeImageRef.current.offsetWidth * 1) / 4;
          const estimatedPage = currentOffsetLeft / widthEachItem;
          if (!isSmall) {
            if (delta.current > 0) {
              const decimal = estimatedPage - parseInt(estimatedPage);
              if (decimal < 0.3) {
                sliderLargeImageRef.current.style.transform = `translateX(-${
                  currentOffsetLeft - delta.current
                }px)`;
              }

              if (
                decimal >= 0.3 &&
                parseInt(estimatedPage) < dataImageList.length - 1
              ) {
                setPage(parseInt(estimatedPage) + 1);
              }
              if (decimal < 0.3) {
                sliderLargeImageRef.current.style.transform = `translateX(-${
                  currentOffsetLeft - delta.current
                }px)`;
              }
              if (parseInt(estimatedPage) >= dataImageList.length - 1) {
                sliderLargeImageRef.current.style.transform = `translateX(-${
                  (100 / dataImageList.length) * (dataImageList.length - 1)
                }%)`;
              }
            }

            if (delta.current < 0) {
              const decimal = estimatedPage - parseInt(estimatedPage);
              if (decimal > 0.7) {
                sliderLargeImageRef.current.style.transform = `translateX(-${
                  currentOffsetLeft - delta.current
                }px)`;
              }

              if (decimal <= 0.7 && parseInt(estimatedPage) >= 0) {
                setPage(parseInt(estimatedPage));
              }
              if (decimal > 0.7) {
                sliderLargeImageRef.current.style.transform = `translateX(-${
                  currentOffsetLeft - delta.current
                }px)`;
              }
              if (parseInt(estimatedPage) < 0) {
                sliderLargeImageRef.current.style.transform = `translateX(-${0}%)`;
              }
            }
          }
          if (isSmall) {
            if (Math.round(estimatedPage) < dataImageList.length - 4) {
              setPage(
                Math.round(estimatedPage) < 0 ? 0 : Math.round(estimatedPage)
              );
            }
            if (Math.round(estimatedPage) >= dataImageList.length - 4) {
              setPage(dataImageList.length - 4);
              sliderLargeImageRef.current.style.transform = `translateX(-${
                (dataImageList.length - 4) * 25
              }%)`;
            }
          }
        }
        setTimeout(() => {
          if (
            sliderImageContainerRef &&
            sliderImageContainerRef.current.className.includes(" sliding")
          ) {
            sliderImageContainerRef.current.className = sliderImageContainerRef.current.className.replace(
              " sliding",
              ""
            );
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
    const subscription = fromEvent(window, "mousemove").subscribe((e) => {
      if (isMouseDownRef.current === true) {
        if (
          sliderImageContainerRef &&
          !sliderImageContainerRef.current.className.includes(" sliding")
        ) {
          sliderImageContainerRef.current.className += " sliding";
        }
        posX2.current = posX1.current - e.clientX;
        if (posX1.current !== 0) {
          // console.log(posX2.current);
          delta.current += posX2.current;
          sliderLargeImageRef.current.style.transition = "0s";
          let currentOffsetLeft;
          if (!isSmall)
            currentOffsetLeft =
              sliderLargeImageRef.current.offsetWidth *
                ((1 / dataImageList.length) * page) +
              delta.current;
          else
            currentOffsetLeft =
              (sliderLargeImageRef.current.offsetWidth *
                (page < dataImageList.length - 4
                  ? page * 25
                  : (dataImageList.length - 4) * 25)) /
                100 +
              delta.current;
          sliderLargeImageRef.current.style.transform = `translateX(-${currentOffsetLeft}px)`;
        }
        posX1.current = e.clientX;
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
    const subscription = fromEvent(
      sliderLargeImageRef.current,
      "touchend"
    ).subscribe(() => {
      setAllowSliding(true);
      sliderLargeImageRef.current.style.height = `${sliderLargeImageRef.current.children[page].offsetHeight}px`;
      sliderLargeImageRef.current.style.transition = "0.5s";
      let currentOffsetLeft;
      if (!isSmall)
        currentOffsetLeft =
          sliderLargeImageRef.current.offsetWidth *
            ((1 / dataImageList.length) * page) +
          delta.current;
      else
        currentOffsetLeft =
          (sliderLargeImageRef.current.offsetWidth *
            (page < dataImageList.length - 4
              ? page * 25
              : (dataImageList.length - 4) * 25)) /
            100 +
          delta.current;
      let widthEachItem;
      if (!isSmall)
        widthEachItem =
          sliderLargeImageRef.current.offsetWidth / dataImageList.length;
      else widthEachItem = (sliderLargeImageRef.current.offsetWidth * 1) / 4;
      const estimatedPage = currentOffsetLeft / widthEachItem;
      if (!isSmall) {
        if (delta.current > 0) {
          const decimal = estimatedPage - parseInt(estimatedPage);
          if (decimal < 0.2) {
            sliderLargeImageRef.current.style.transform = `translateX(-${
              currentOffsetLeft - delta.current
            }px)`;
          }

          if (
            decimal >= 0.2 &&
            parseInt(estimatedPage) < dataImageList.length - 1
          ) {
            setPage(parseInt(estimatedPage) + 1);
          }
          if (decimal < 0.2) {
            sliderLargeImageRef.current.style.transform = `translateX(-${
              currentOffsetLeft - delta.current
            }px)`;
          }
          if (parseInt(estimatedPage) >= dataImageList.length - 1) {
            sliderLargeImageRef.current.style.transform = `translateX(-${
              (100 / dataImageList.length) * (dataImageList.length - 1)
            }%)`;
          }
        }

        if (delta.current < 0) {
          const decimal = estimatedPage - parseInt(estimatedPage);
          if (decimal > 0.8) {
            sliderLargeImageRef.current.style.transform = `translateX(-${
              currentOffsetLeft - delta.current
            }px)`;
          }

          if (decimal <= 0.8 && parseInt(estimatedPage) >= 0) {
            setPage(parseInt(estimatedPage));
          }
          if (decimal > 0.8) {
            sliderLargeImageRef.current.style.transform = `translateX(-${
              currentOffsetLeft - delta.current
            }px)`;
          }
          if (parseInt(estimatedPage) < 0) {
            sliderLargeImageRef.current.style.transform = `translateX(-${0}%)`;
          }
        }
      }
      if (isSmall) {
        if (Math.round(estimatedPage) < dataImageList.length - 4) {
          setPage(
            Math.round(estimatedPage) < 0 ? 0 : Math.round(estimatedPage)
          );
        }
        if (Math.round(estimatedPage) >= dataImageList.length - 4) {
          setPage(dataImageList.length - 4);
          sliderLargeImageRef.current.style.transform = `translateX(-${
            (dataImageList.length - 4) * 25
          }%)`;
        }
      }
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
  allowSliding,
  setAllowSliding
) => {
  useEffect(() => {
    const subscription = fromEvent(sliderLargeImageRef.current, "touchmove")
      .pipe(filter(() => allowSliding === true))
      .subscribe((e) => {
        // if(allowSliding === true) setAllowSliding(false);
        posX2.current = posX1.current - e.touches[0].clientX;
        if (posX1.current !== 0) {
          // console.log(posX2.current);
          delta.current += posX2.current;
          sliderLargeImageRef.current.style.transition = "0s";
          let currentOffsetLeft;
          if (!isSmall)
            currentOffsetLeft =
              sliderLargeImageRef.current.offsetWidth *
                ((1 / dataImageList.length) * page) +
              delta.current;
          else
            currentOffsetLeft =
              (sliderLargeImageRef.current.offsetWidth *
                (page < dataImageList.length - 4
                  ? page * 25
                  : (dataImageList.length - 4) * 25)) /
                100 +
              delta.current;
          sliderLargeImageRef.current.style.transform = `translateX(-${currentOffsetLeft}px)`;
        }
        posX1.current = e.touches[0].clientX;
      });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataImageList.length, isSmall, page, allowSliding]);
};
