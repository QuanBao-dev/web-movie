/* eslint-disable react-hooks/exhaustive-deps */
import "./Carousel.css";

import loadable from "@loadable/component";
import Axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";

import { carouselStream } from "../../epics/carousel";
import { userStream } from "../../epics/user";
import {
  useAutoSlidingNextPage,
  useFetchCarousel,
  useInitCarousel,
} from "../../Hook/carousel";
import navBarStore from "../../store/navbar";

const CarouselItem = loadable(() => import("../CarouselItem/CarouselItem"), {
  fallback: (
    <div className="section-carousel-container">
      <i className="fas fa-spinner fa-9x fa-spin"></i>
    </div>
  ),
});
const Carousel = () => {
  const user = userStream.currentState();
  const [cookies] = useCookies(["idCartoonUser"]);
  const [carouselState, setCarouselState] = useState(
    carouselStream.currentState()
  );
  const [pageCarousel, setPageCarousel] = useState(0);
  const history = useHistory();
  useInitCarousel(setCarouselState);
  useFetchCarousel();
  useAutoSlidingNextPage(pageCarousel, setPageCarousel);
  // console.log(pageCarousel);
  const { dataCarousel } = carouselState;
  if (pageCarousel === dataCarousel.length) {
    setTimeout(() => {
      if (document.querySelector(".section-carousel-container")) {
        document.querySelector(".section-carousel-container").style.transition =
          "0s";
        setPageCarousel(0);
      }
    }, 400);
  }
  if (pageCarousel === -1) {
    setTimeout(() => {
      if (document.querySelector(".section-carousel-container")) {
        document.querySelector(".section-carousel-container").style.transition =
          "0s";
        setPageCarousel(dataCarousel.length - 1);
      }
    }, 400);
  }
  const pageDisplay =
    pageCarousel === -1
      ? dataCarousel.length - 1
      : pageCarousel === dataCarousel.length
      ? 0
      : pageCarousel;
  // console.log(stream.currentState());
  return (
    <div>
      <div className="background">
        <div className="container-menu-control">
          <div
            className="button-left hover-button"
            onClick={() => {
              const page = pageCarousel;
              if (page - 1 >= -1) {
                document.querySelector(
                  ".section-carousel-container"
                ).style.transition = "0.4s";
                setPageCarousel(page - 1);
              }
            }}
          >
            <i className="fas fa-caret-left fa-4x"></i>
          </div>
          <div
            className="button-right hover-button"
            onClick={() => {
              const page = pageCarousel;
              if (page + 1 <= dataCarousel.length) {
                document.querySelector(
                  ".section-carousel-container"
                ).style.transition = "0.4s";
                setPageCarousel(page + 1);
              }
            }}
          >
            <i className="fas fa-caret-right fa-4x"></i>
          </div>
        </div>
        {user && user.role === "Admin" && (
          <div className="button-update-carousel-container">
            <button
              className="btn btn-success"
              onClick={async () => {
                navBarStore.updateIsShowBlockPopUp(true);
                try {
                  const dataRes = await Axios.post(
                    "/api/movies/carousel/crawl",
                    {},
                    {
                      headers: {
                        authorization: `Bearer ${cookies.idCartoonUser}`,
                      },
                    }
                  );
                  carouselStream.updateData({
                    dataCarousel: dataRes.data.message,
                  });
                } catch (error) {
                  alert(error.response.data.error);
                }
                navBarStore.updateIsShowBlockPopUp(false);
              }}
            >
              Update
            </button>

            <button
              className="btn btn-primary"
              onClick={async () => {
                navBarStore.updateIsShowBlockPopUp(true);
                try {
                  const dataRes = await Axios.post(
                    "/api/movies/carousel/crawl/trial",
                    {},
                    {
                      headers: {
                        authorization: `Bearer ${cookies.idCartoonUser}`,
                      },
                    }
                  );
                  carouselStream.updateData({
                    dataCarousel: dataRes.data.message,
                  });
                } catch (error) {
                  alert(error.response.data.error);
                }
                navBarStore.updateIsShowBlockPopUp(false);
              }}
            >
              Trial
            </button>
          </div>
        )}
        <section className="layout-section">
          <div
            className="section-carousel-container"
            style={{
              transform: `translateX(${
                document.querySelector(".item")
                  ? -document.querySelector(".item").offsetWidth *
                      pageCarousel -
                    document.querySelector(".item").offsetWidth
                  : -document.body.scrollWidth
              }px)`,
            }}
          >
            {dataCarousel && dataCarousel[dataCarousel.length - 1] && (
              <CarouselItem
                data={dataCarousel[dataCarousel.length - 1]}
                history={history}
              />
            )}
            {dataCarousel &&
              dataCarousel.map((data, index) => (
                <CarouselItem key={index} data={data} history={history} />
              ))}
            {dataCarousel && dataCarousel[0] && (
              <CarouselItem data={dataCarousel[0]} history={history} />
            )}
          </div>
        </section>
      </div>
      <div className="list-dot-carousel">
        {dataCarousel &&
          dataCarousel.map((data, key) => (
            <div
              key={key}
              onClick={() => {
                document.querySelector(
                  ".section-carousel-container"
                ).style.transition = "0.4s";
                setPageCarousel(key);
              }}
              className={`dot-item${pageDisplay === key ? " active-dot" : ""}`}
            ></div>
          ))}
      </div>
    </div>
  );
};

export default Carousel;
