/* eslint-disable react-hooks/exhaustive-deps */
import './Carousel.css';

import loadable from '@loadable/component';
import React, { useRef } from 'react';

import { carouselStream } from '../../epics/carousel';
import { userStream } from '../../epics/user';
import { updatePageActiveSlide, useGenerateVariableCarousel, useSlideFeature } from '../../Hook/slideScrollDrag';
import FormEditCarousel from '../FormEditCarousel/FormEditCarousel';

// import CarouselItem from "../CarouselItem/CarouselItem";
const CarouselItem = loadable(() => import("../CarouselItem/CarouselItem"), {
  fallback: (
    <div className="section-carousel-container">
      <i className="fas fa-spinner fa-9x fa-spin"></i>
    </div>
  ),
});
const Carousel = ({ dataCarousel }) => {
  const user = userStream.currentState();
  const {
    amountProductsEachPageStateList,
    isDisplayLayerBlockStateList,
    dataList,
    isIntervalModeRef,
    listProductsWrapperRef,
    pageActiveStateList,
    realPageStateList,
    timeoutRef,
  } = useGenerateVariableCarousel(1, true, dataCarousel);

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
  useSlideFeature(
    carouselSlideListWrapperRef,
    amountProductsEachPage,
    pageActive,
    setPageActive,
    setIsDisplayLayerBlock,
    dataCarousel.length,
    { arrayWidthCondition: null, setAmountProductsEachPage: null },
    { initIsIntervalModeRef: isIntervalMode, secondTimeInterval: 3 },
    timeout,
    setRealPage,
    realPage,
    isDisplayLayerBlock
  );
  return (
    <div>
      <FormEditCarousel />
      <div className="background">
        <div className="container-menu-control">
          <div
            className="button-left hover-button"
            onClick={() => {
              if (pageActive - dataCarousel.length > 1) {
                updatePageActive(pageActive - 1, true);
              }
              if (pageActive - dataCarousel.length === 1 && !timeout2.current) {
                carouselSlideListWrapperRef.current.style.transition = "0.5s";
                carouselSlideListWrapperRef.current.style.transform = `translateX(${
                  carouselSlideListWrapperRef.current.children[0].offsetWidth *
                  (amountProductsEachPage - (pageActive - 1))
                }px)`;
                carouselSlideListWrapperRef.current.style.height = `${
                  carouselSlideListWrapperRef.current.children[
                    pageActive - 1 - 1
                  ].offsetHeight
                }px`;
                timeout2.current = setTimeout(() => {
                  updatePageActive(dataCarousel.length * 2);
                  timeout2.current = null;
                }, 500);
              }
              // const page = pageCarousel;
              // if (page - 1 >= -1) {
              //   document.querySelector(
              //     ".section-carousel-container"
              //   ).style.transition = "0.4s";
              //   setPageCarousel(page - 1);
              // }
            }}
          >
            <i className="fas fa-caret-left fa-4x"></i>
          </div>
          <div
            className="button-right hover-button"
            onClick={() => {
              if (pageActive - dataCarousel.length < dataCarousel.length) {
                updatePageActive(pageActive + 1, true);
              }

              if (
                pageActive - dataCarousel.length === dataCarousel.length &&
                !timeout2.current
              ) {
                carouselSlideListWrapperRef.current.style.transition = "0.5s";
                carouselSlideListWrapperRef.current.style.transform = `translateX(${
                  carouselSlideListWrapperRef.current.children[0].offsetWidth *
                  (amountProductsEachPage - (pageActive + 1))
                }px)`;
                carouselSlideListWrapperRef.current.style.height = `${carouselSlideListWrapperRef.current.children[pageActive].offsetHeight}px`;
                timeout2.current = setTimeout(() => {
                  updatePageActive(1 + dataCarousel.length);
                  timeout2.current = null;
                }, 500);
              }
              // const page = pageCarousel;
              // if (page + 1 <= dataCarousel.length) {
              //   document.querySelector(
              //     ".section-carousel-container"
              //   ).style.transition = "0.4s";
              //   setPageCarousel(page + 1);
              // }
            }}
          >
            <i className="fas fa-caret-right fa-4x"></i>
          </div>
        </div>
        {user && user.role === "Admin" && (
          <div className="button-update-carousel-container">
            <button
              className="btn btn-success"
              onClick={() => {
                carouselStream.updateData({ isShowFormEditCarousel: true });
              }}
            >
              Update
            </button>
          </div>
        )}
        <section className="layout-section">
          {isDisplayLayerBlock && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: "0",
                zIndex: 30,
                cursor: "grabbing",
              }}
            ></div>
          )}
          <div
            className="section-carousel-container"
            ref={carouselSlideListWrapperRef}
          >
            {dataList.map((data, key) => (
              <CarouselItem key={key} data={data} />
            ))}
          </div>
        </section>
      </div>
      <div className="list-dot-carousel">
        {dataCarousel &&
          dataCarousel.map((data, key) => (
            <div
              key={key}
              onClick={() => {
                updatePageActive(key + 1 + dataCarousel.length, true);
              }}
              className={`dot-item${
                (realPage % dataCarousel.length || dataCarousel.length) - 1 ===
                key
                  ? " active-dot"
                  : ""
              }`}
            ></div>
          ))}
      </div>
    </div>
  );
};

export default Carousel;
