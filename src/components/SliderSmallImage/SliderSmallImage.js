import "./SliderSmallImage.css";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useMouseMoveHandling,
  useMouseUpHandling,
  useTouchEndHandling,
  useTouchMoveHandling,
} from "../../Hook/slideScrollDrag";
import { fromEvent } from "rxjs";
import { debounceTime, tap } from "rxjs/operators";
import navBarStore from "../../store/navbar";

const SliderSmallImage = ({
  sliderLargeImageRef,
  dataListImage,
  page,
  setPage,
}) => {
  const [pageInternal, setPageInternal] = useState(0);
  const sliderSmallImageRef = useRef();
  const sliderSmallImageContainerRef = useRef();
  const posX1 = useRef(0);
  const posX2 = useRef(0);
  const delta = useRef(0);
  const isMouseDownRef = useRef(null);
  const [allowSliding, setAllowSliding] = useState(true);
  const isMobile = useMemo(() => {
    return navBarStore.currentState().isMobile;
  }, []);
  useEffect(() => {
    const subscription = fromEvent(window, "scroll")
      .pipe(
        tap(() => {
          if (allowSliding === true && isMobile) setAllowSliding(false);
          sliderSmallImageRef.current.style.transform = `translateX(-${
            pageInternal < dataListImage.length - 4
              ? pageInternal * 25
              : (dataListImage.length - 4) * 25
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
  }, [allowSliding, dataListImage.length, pageInternal]);
  useEffect(() => {
    sliderSmallImageRef.current.style.transition = "0.5s";
    setPageInternal(page);
  }, [page]);
  useMouseUpHandling(
    isMouseDownRef,
    sliderSmallImageContainerRef,
    sliderSmallImageRef,
    dataListImage,
    pageInternal,
    delta,
    setPageInternal,
    posX1,
    posX2,
    true
  );
  useMouseMoveHandling(
    isMouseDownRef,
    sliderSmallImageContainerRef,
    posX1,
    posX2,
    delta,
    sliderSmallImageRef,
    dataListImage,
    pageInternal,
    true
  );
  useTouchMoveHandling(
    sliderSmallImageRef,
    posX2,
    posX1,
    delta,
    true,
    dataListImage,
    pageInternal,
    allowSliding
  );

  useTouchEndHandling(
    sliderSmallImageRef,
    true,
    dataListImage,
    pageInternal,
    delta,
    posX1,
    posX2,
    setPageInternal,
    setAllowSliding
  );
  return (
    <div
      className="slider-small-image-container"
      ref={sliderSmallImageContainerRef}
    >
      <div className="layer-block"></div>
      {dataListImage.length > 4 && (
        <i
          className="fas fa-chevron-right"
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onClick={() => {
            pageInternal < dataListImage.length - 4
              ? setPageInternal(pageInternal + 1)
              : setPageInternal(0);
          }}
        ></i>
      )}
      {dataListImage.length > 4 && (
        <i
          className="fas fa-chevron-left"
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onClick={() => {
            pageInternal > 0
              ? setPageInternal(pageInternal - 1)
              : setPageInternal(dataListImage.length - 4);
          }}
        ></i>
      )}
      <ul
        className="slider-small-image"
        ref={sliderSmallImageRef}
        onMouseDown={(e) => {
          e.preventDefault();
          isMouseDownRef.current = true;
        }}
        style={{
          transform: `translateX(-${
            pageInternal < dataListImage.length - 4
              ? pageInternal * 25
              : (dataListImage.length - 4) * 25
          }%)`,
        }}
      >
        {dataListImage.map((imageUrl, key) => (
          <li
            className={`slider-small-image-item${
              key === page ? " active" : ""
            }`}
            style={{
              minWidth:
                dataListImage.length > 4
                  ? null
                  : `${100 / dataListImage.length}%`,
            }}
            key={key}
            onClick={() => {
              sliderLargeImageRef.current.style.transition = "0.5s";
              setPage(key);
            }}
          >
            <div style={{ padding: "0 0.5rem" }}>
              <img src={imageUrl} alt={"image_game_2"}></img>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SliderSmallImage;
