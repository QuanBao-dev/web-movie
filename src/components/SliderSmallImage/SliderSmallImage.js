import "./SliderSmallImage.css";

import React, { useEffect, useRef, useState } from "react";
import { fromEvent } from "rxjs";
import { filter } from "rxjs/operators";
import { mobileAndTabletCheck } from "../../util/checkMobileDevice";
const SliderSmallImage = ({
  dataImageList,
  page,
  setPage,
  triggerSlideSmallImage,
  setTriggerSlideSmallImage,
}) => {
  const carouselSmallImageListWrapperRef = useRef();
  const isMouseDownRef = useRef();
  const posX1 = useRef(0);
  const posX2 = useRef(0);
  const touchClientYList = useRef([]);
  const [smallPage, setSmallPage] = useState(0);
  const [isOverlayDisplay, setIsOverlayDisplay] = useState(false);
  const isMobileRef = useRef(mobileAndTabletCheck());

  useEffect(() => {
    const widthItem =
      carouselSmallImageListWrapperRef.current.children[0].offsetWidth;
    carouselSmallImageListWrapperRef.current.style.transform = `translateX(${
      -widthItem * smallPage
    }px)`;
  }, [smallPage]);
  useEffect(() => {
    if (dataImageList.length <= 4) {
      setSmallPage(0);
      return;
    }
    if (page > dataImageList.length - 4) {
      setSmallPage(dataImageList.length - 4);
      return;
    }
    setSmallPage(page - 1);
  }, [dataImageList.length, page]);

  useEffect(() => {
    const subscription = fromEvent(
      carouselSmallImageListWrapperRef.current,
      isMobileRef.current ? "touchstart" : "mousedown"
    ).subscribe((e) => {
      if (!isMobileRef.current) e.preventDefault();
      isMouseDownRef.current = true;
    });
    ///////////////////////
    const subscription2 = fromEvent(
      window,
      isMobileRef.current ? "touchmove" : "mousemove"
    )
      .pipe(filter(() => isMouseDownRef.current))
      .subscribe((e) => {
        if (isMobileRef.current) {
          if (touchClientYList.current.length < 5) {
            touchClientYList.current.push(window.scrollY);
            return;
          }
          if (
            touchClientYList.current.length === 5 &&
            Math.abs(
              touchClientYList.current[touchClientYList.current.length - 1] -
                touchClientYList.current[0]
            ) > 1
          )
            return;
        }
        const translateX = parseFloat(
          carouselSmallImageListWrapperRef.current.style.transform
            .replace("translateX(", "")
            .replace("px)")
        );
        carouselSmallImageListWrapperRef.current.style.transition = "0s";
        if (isMobileRef.current) {
          posX2.current = posX1.current - e.touches[0].clientX;
          if (posX1.current) {
            carouselSmallImageListWrapperRef.current.style.transform = `translateX(${
              translateX - posX2.current
            }px)`;
          }
          posX1.current = e.touches[0].clientX;
          return;
        }
        setIsOverlayDisplay(true);
        carouselSmallImageListWrapperRef.current.style.transform = `translateX(${
          translateX + e.movementX
        }px)`;
      });
    ////////////////////////
    const subscription3 = fromEvent(
      window,
      isMobileRef.current ? "touchend" : "mouseup"
    ).subscribe(() => {
      isMouseDownRef.current = false;
      posX1.current = 0;
      posX2.current = 0;
      touchClientYList.current = [];
      carouselSmallImageListWrapperRef.current.style.transition = "0.5s";
      const widthItem =
        carouselSmallImageListWrapperRef.current.children[0].offsetWidth;
      const translateX = parseFloat(
        carouselSmallImageListWrapperRef.current.style.transform
          .replace("translateX(", "")
          .replace("px)")
      );

      const estimatedPage = Math.abs(Math.round(translateX / widthItem));
      if (translateX > 0 || dataImageList.length <= 4) {
        setIsOverlayDisplay(false);
        if (smallPage === 0) {
          carouselSmallImageListWrapperRef.current.style.transform = `translateX(${0}px)`;
          return;
        }
        setSmallPage(0);
        return;
      }
      if (estimatedPage > dataImageList.length - 4) {
        setIsOverlayDisplay(false);
        if (smallPage === dataImageList.length - 4) {
          carouselSmallImageListWrapperRef.current.style.transform = `translateX(${
            -widthItem * (dataImageList.length - 4)
          }px)`;
          return;
        }
        setSmallPage(dataImageList.length - 4);
        return;
      }
      setIsOverlayDisplay(false);
      if (smallPage === estimatedPage) {
        carouselSmallImageListWrapperRef.current.style.transform = `translateX(${
          -estimatedPage * widthItem
        }px)`;
        return;
      }
      setSmallPage(estimatedPage);
    });
    return () => {
      subscription.unsubscribe();
      subscription2.unsubscribe();
      subscription3.unsubscribe();
    };
  }, [dataImageList.length, smallPage]);
  return (
    <div className="carousel-small-image-list-container">
      {isOverlayDisplay && <div className="carousel-small-image-overlay" />}
      {smallPage !== 0 && (
        <i
          className="fas fa-chevron-left small-carousel-prev-button"
          onClick={() => {
            if (smallPage > 0) {
              setSmallPage(smallPage - 1);
            }
          }}
        ></i>
      )}
      {smallPage < dataImageList.length - 4 && (
        <i
          className="fas fa-chevron-right small-carousel-next-button"
          onClick={() => {
            if (smallPage < dataImageList.length - 4) {
              setSmallPage(smallPage + 1);
            }
          }}
        ></i>
      )}
      <div
        className="carousel-small-image-list-wrapper"
        ref={carouselSmallImageListWrapperRef}
      >
        {dataImageList.map((imageUrl, key) => (
          <div
            key={key}
            className="carousel-small-image-item"
            style={{
              minWidth: `${100 / 4}%`,
            }}
          >
            <img
              src={imageUrl}
              alt=""
              style={{
                opacity: key === page - 1 ? "1" : "0.3",
              }}
              onClick={() => {
                setPage(key + 1);
                setTriggerSlideSmallImage(!triggerSlideSmallImage);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderSmallImage;
