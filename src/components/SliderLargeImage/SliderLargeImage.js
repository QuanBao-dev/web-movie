import "./SliderLargeImage.css";

import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { fromEvent } from "rxjs";
import { debounceTime, tap } from "rxjs/operators";

import {
  useMouseMoveHandling,
  useMouseUpHandling,
  useTouchEndHandling,
  useTouchMoveHandling,
} from "../../Hook/slideScrollDrag";

const SliderLargeImage = ({ dataImageList, page, setPage }) => {
  const sliderLargeImageRef = useRef();
  const isMouseDownRef = useRef(null);
  const posX1 = useRef(0);
  const posX2 = useRef(0);
  const delta = useRef(0);
  const [allowSliding, setAllowSliding] = useState(true);
  useEffect(() => {
    const subscription = fromEvent(window, "scroll")
      .pipe(
        tap(() => {
          if (
            sliderLargeImageRef.current &&
            sliderLargeImageRef.current.children.length > 0 &&
            sliderLargeImageRef.current.children[page]
          )
            sliderLargeImageRef.current.style.height = `${sliderLargeImageRef.current.children[page].offsetHeight}px`;
          if (allowSliding === true) setAllowSliding(false);
          sliderLargeImageRef.current.style.transform = `translateX(-${
            (100 / dataImageList.length) * page
          }%)`;
        }),
        debounceTime(350)
      )
      .subscribe(() => {
        if (allowSliding === false) setAllowSliding(true);
      });
    return () => {
      subscription.unsubscribe();
    };
  }, [allowSliding, dataImageList.length, page]);
  useEffect(() => {
    setAllowSliding(true);
    const subscription2 = fromEvent(window, "resize").subscribe(() => {
      sliderLargeImageRef.current.style.height = `${sliderLargeImageRef.current.children[page].offsetHeight}px`;
    });
    if (
      sliderLargeImageRef.current &&
      sliderLargeImageRef.current.children.length > 0 &&
      sliderLargeImageRef.current.children[page]
    )
      sliderLargeImageRef.current.style.height = `${sliderLargeImageRef.current.children[page].offsetHeight}px`;
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
    allowSliding,
    setAllowSliding
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
    <div className="slider-large-image-container">
      <i
        onMouseDown={(e) => {
          e.preventDefault();
        }}
        className="fas fa-chevron-right"
        onClick={() =>
          page < dataImageList.length - 1 ? setPage(page + 1) : setPage(0)
        }
      ></i>
      <i
        onMouseDown={(e) => {
          e.preventDefault();
        }}
        className="fas fa-chevron-left"
        onClick={() =>
          page > 0 ? setPage(page - 1) : setPage(dataImageList.length - 1)
        }
      ></i>
      <ul
        className="slider-large-image"
        ref={sliderLargeImageRef}
        style={{
          width: `${dataImageList.length * 100}%`,
          transform: `translateX(-${(100 / dataImageList.length) * page}%)`,
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          isMouseDownRef.current = true;
        }}
      >
        {dataImageList &&
          dataImageList.map((imageUrl, index) => (
            <li className="slider-large-image-item" key={index}>
              <img src={imageUrl} alt={"image_anime"}></img>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default SliderLargeImage;
