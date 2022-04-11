import "./SliderLargeImage.css";

import React, { useEffect, useRef } from "react";

import {
  updatePageActiveSlide,
  useGenerateVariableCarousel,
  useSlideFeature,
} from "../../Hook/slideScrollDrag";

const SliderLargeImage = ({
  dataImageList,
  setPage,
  page,
  triggerSlideSmallImage,
}) => {
  const {
    amountProductsEachPageStateList,
    isDisplayLayerBlockStateList,
    dataList,
    isIntervalModeRef,
    listProductsWrapperRef,
    pageActiveStateList,
    realPageStateList,
    timeoutRef,
  } = useGenerateVariableCarousel(1, null, dataImageList);
  const [amountProductsEachPage] = amountProductsEachPageStateList;
  const [realPage, setRealPage] = realPageStateList;
  const [pageActive, setPageActive] = pageActiveStateList;
  const [isDisplayLayerBlock, setIsDisplayLayerBlock] =
    isDisplayLayerBlockStateList;
  const carouselSlideListWrapperRef = listProductsWrapperRef;
  const isIntervalMode = isIntervalModeRef;
  const timeout = timeoutRef;
  const timeout2 = useRef();
  const updatePageActive = (page, isAnimation) => {
    updatePageActiveSlide(
      carouselSlideListWrapperRef,
      page,
      isAnimation,
      timeout,
      setPageActive,
      setRealPage
    );
  };

  useEffect(() => {
    carouselSlideListWrapperRef.current.style.height = `${
      carouselSlideListWrapperRef.current.children[realPage - 1].offsetHeight
    }px`;
    setPage(realPage - dataImageList.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realPage]);

  useEffect(() => {
    if (page !== undefined) updatePageActive(page + dataImageList.length, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerSlideSmallImage]);

  useSlideFeature(
    carouselSlideListWrapperRef,
    amountProductsEachPage,
    pageActive,
    setPageActive,
    setIsDisplayLayerBlock,
    dataImageList.length,
    { arrayWidthCondition: null, setAmountProductsEachPage: null },
    { initIsIntervalModeRef: isIntervalMode, secondTimeInterval: 5 },
    timeout,
    setRealPage,
    realPage,
    isDisplayLayerBlock
  );
  return (
    <div className="carousel-slide-list">
      <i
        className="fas fa-chevron-left carousel-prev-button"
        onClick={() => {
          if (pageActive - dataImageList.length > 1) {
            updatePageActive(pageActive - 1, true);
          }
          if (pageActive - dataImageList.length === 1 && !timeout2.current) {
            carouselSlideListWrapperRef.current.style.transition = "0.5s";
            carouselSlideListWrapperRef.current.style.transform = `translateX(${
              carouselSlideListWrapperRef.current.children[0].offsetWidth *
              (amountProductsEachPage - (pageActive - 1))
            }px)`;
            carouselSlideListWrapperRef.current.style.height = `${
              carouselSlideListWrapperRef.current.children[pageActive - 1 - 1]
                .offsetHeight
            }px`;
            timeout2.current = setTimeout(() => {
              updatePageActive(dataImageList.length * 2);
              timeout2.current = null;
            }, 500);
          }
        }}
      ></i>
      <i
        className="fas fa-chevron-right carousel-next-button"
        onClick={() => {
          if (pageActive - dataImageList.length < dataImageList.length) {
            updatePageActive(pageActive + 1, true);
          }

          if (
            pageActive - dataImageList.length === dataImageList.length &&
            !timeout2.current
          ) {
            carouselSlideListWrapperRef.current.style.transition = "0.5s";
            carouselSlideListWrapperRef.current.style.transform = `translateX(${
              carouselSlideListWrapperRef.current.children[0].offsetWidth *
              (amountProductsEachPage - (pageActive + 1))
            }px)`;
            carouselSlideListWrapperRef.current.style.height = `${carouselSlideListWrapperRef.current.children[pageActive].offsetHeight}px`;
            timeout2.current = setTimeout(() => {
              updatePageActive(1 + dataImageList.length);
              timeout2.current = null;
            }, 500);
          }
        }}
      ></i>
      <div
        className="carousel-slide-list-wrapper"
        ref={carouselSlideListWrapperRef}
      >
        {dataList.map((imageUrl, key) => (
          <div key={key} className="carousel-slide-item">
            <img
              src={imageUrl}
              alt="Not found"
              onLoad={() => {
                carouselSlideListWrapperRef.current.style.height = `${
                  carouselSlideListWrapperRef.current.children[realPage - 1]
                    .offsetHeight
                }px`;
              }}
              onError={() => {
                if (key === 0) {
                  document.body.style.backgroundImage = `url(${dataImageList[1]})`;
                }
                carouselSlideListWrapperRef.current.children[key].querySelector(
                  "img"
                ).src =
                  "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderLargeImage;
