import "./SliderLargeImage.css";

import React, { useEffect, useRef } from "react";
import { useState, useMemo } from "react";
import { fromEvent } from "rxjs";
import { debounceTime, tap } from "rxjs/operators";

import {
  useMouseMoveHandling,
  useMouseUpHandling,
  useTouchEndHandling,
  useTouchMoveHandling,
} from "../../Hook/slideScrollDrag";
import navBarStore from "../../store/navbar";
const SliderLargeImage = ({ dataImageList, page, setPage, isLoading }) => {
  const sliderLargeImageRef = useRef();
  const isMouseDownRef = useRef(null);
  const posX1 = useRef(0);
  const posX2 = useRef(0);
  const delta = useRef(0);
  const imageRef = useRef();
  const [allowSliding, setAllowSliding] = useState(true);
  const isMobile = useMemo(() => {
    return navBarStore.currentState().isMobile;
  }, []);
  useEffect(() => {
    let subscription;
    if (!isLoading && imageRef.current) {
      subscription = fromEvent(imageRef.current, "load").subscribe(() => {
        setTimeout(() => {
          if (
            sliderLargeImageRef.current &&
            sliderLargeImageRef.current.children.length > 0 &&
            sliderLargeImageRef.current.children[page + 1]
          )
            sliderLargeImageRef.current.style.height = `${
              sliderLargeImageRef.current.children[page + 1].offsetHeight
            }px`;
        }, 500);
      });
    }
    return () => {
      subscription && subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
  useEffect(() => {
    const subscription = fromEvent(window, "scroll")
      .pipe(
        tap(() => {
          if (
            sliderLargeImageRef.current &&
            sliderLargeImageRef.current.children.length > 0 &&
            sliderLargeImageRef.current.children[page + 1]
          )
            sliderLargeImageRef.current.style.height = `${
              sliderLargeImageRef.current.children[page + 1].offsetHeight
            }px`;
          if (allowSliding === true && isMobile) setAllowSliding(false);
          sliderLargeImageRef.current.style.transition = "0.5s";
          sliderLargeImageRef.current.style.transform = `translateX(-${
            (100 / (dataImageList.length + 2)) * (page + 1)
          }%)`;
        }),
        debounceTime(1000)
      )
      .subscribe(() => {
        if (allowSliding === false) setAllowSliding(true);
      });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowSliding, dataImageList.length, page]);
  useEffect(() => {
    const subscription2 = fromEvent(window, "resize").subscribe(() => {
      sliderLargeImageRef.current.style.height = `${
        sliderLargeImageRef.current.children[page + 1].offsetHeight
      }px`;
    });
    if (
      sliderLargeImageRef.current &&
      sliderLargeImageRef.current.children.length > 0 &&
      sliderLargeImageRef.current.children[page + 1]
    ) {
      sliderLargeImageRef.current.style.height = `${
        sliderLargeImageRef.current.children[page + 1].offsetHeight
      }px`;
    }
    return () => {
      subscription2.unsubscribe();
    };
  }, [page, dataImageList.length]);
  useMouseUpHandling(
    isMouseDownRef,
    null,
    sliderLargeImageRef,
    dataImageList,
    page,
    delta,
    setPage,
    posX1,
    posX2,
    false
  );

  useMouseMoveHandling(
    isMouseDownRef,
    null,
    posX1,
    posX2,
    delta,
    sliderLargeImageRef,
    dataImageList,
    page,
    false
  );

  useTouchMoveHandling(
    sliderLargeImageRef,
    posX2,
    posX1,
    delta,
    false,
    dataImageList,
    page,
    allowSliding
  );

  useTouchEndHandling(
    sliderLargeImageRef,
    false,
    dataImageList,
    page,
    delta,
    posX1,
    posX2,
    setPage,
    setAllowSliding
  );
  return (
    <div className="slider-large-image-container hover">
      {!isMobile && (
        <i
          onMouseDown={(e) => e.preventDefault()}
          className="fas fa-chevron-right"
          onClick={() => {
            sliderLargeImageRef.current.style.transition = "0.5s";
            if (page < dataImageList.length - 1) {
              setPage(page + 1);
            }
            if (page === dataImageList.length - 1) {
              setPage(dataImageList.length);
              setTimeout(() => {
                sliderLargeImageRef.current.style.transition = "0s";
                setPage(0);
              }, 500);
            }
          }}
        ></i>
      )}
      {!isMobile && (
        <i
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          className="fas fa-chevron-left"
          onClick={() => {
            sliderLargeImageRef.current.style.transition = "0.5s";
            if (page > 0) {
              setPage(page - 1);
            }
            if (page === 0) {
              // clearTimeout(timeout);
              setPage(-1);
              setTimeout(() => {
                sliderLargeImageRef.current.style.transition = "0s";
                setPage(dataImageList.length - 1);
              }, 500);
            }
          }}
        ></i>
      )}
      <ul
        className="slider-large-image"
        ref={sliderLargeImageRef}
        style={{
          width: `${(dataImageList.length + 2) * 100}%`,
          transform: `translateX(-${
            (100 / (dataImageList.length + 2)) * (page + 1)
          }%)`,
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          isMouseDownRef.current = true;
        }}
      >
        <li className="slider-large-image-item">
          <img
            src={dataImageList[dataImageList.length - 1]}
            alt={"image_anime"}
          ></img>
        </li>
        {dataImageList &&
          dataImageList.map((imageUrl, index) => (
            <li className="slider-large-image-item" key={index}>
              <img
                src={imageUrl}
                alt={"image_anime"}
                ref={index === 0 ? imageRef : null}
              ></img>
            </li>
          ))}
        <li className="slider-large-image-item">
          <img src={dataImageList[0]} alt={"image_anime"}></img>
        </li>
      </ul>
    </div>
  );
};

export default SliderLargeImage;
