/* eslint-disable react-hooks/exhaustive-deps */
import "./Carousel.css";

import React, { useEffect, useState } from "react";
import { ajax } from "rxjs/ajax";
import { pluck } from "rxjs/operators";
import { stream } from "../../epics/home";
import { userStream } from "../../epics/user";
import Axios from "axios";
import { useCookies } from "react-cookie";
import navBarStore from "../../store/navbar";
import { interval } from "rxjs";
import { useHistory } from "react-router-dom";
const Carousel = () => {
  const { dataCarousel } = stream.currentState();
  const user = userStream.currentState();
  const [cookies] = useCookies(["idCartoonUser"]);
  const [pageCarousel, setPageCarousel] = useState(3);
  const history = useHistory();
  useEffect(() => {
    const subscription = fetchData$().subscribe((v) => {
      stream.updateDataCarousel(v);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    const intervalSub = interval(5000).subscribe(() => {
      const page = pageCarousel;
      document.querySelector(".section-carousel-container").style.transition =
        "0.4s";
      setPageCarousel(page + 1);
    });
    return () => {
      intervalSub.unsubscribe();
    };
  }, [pageCarousel]);
  // console.log(pageCarousel);
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
  // console.log(stream.currentState());
  return (
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
                stream.updateDataCarousel(dataRes.data.message);
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
                stream.updateDataCarousel(dataRes.data.message);
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
                ? -document.querySelector(".item").offsetWidth * pageCarousel -
                  document.querySelector(".item").offsetWidth
                : 0
            }px)`,
          }}
        >
          {dataCarousel && dataCarousel[dataCarousel.length - 1] && (
            <div className="item">
              <img
                src={dataCarousel[dataCarousel.length - 1].url}
                alt="NOT_FOUND"
              />
              <div className="container-title">
                <h1>{dataCarousel[dataCarousel.length - 1].title}</h1>
              </div>
            </div>
          )}
          {dataCarousel &&
            dataCarousel.map((data, index) => (
              <div className="item" key={index} onClick={() => {
                if(data.malId){
                  history.push("/anime/"+data.malId);
                }
              }}>
                <img src={data.url} alt="NOT_FOUND" />
                <div className="container-title">
                  <h1>{data.title}</h1>
                </div>
              </div>
            ))}
          {dataCarousel && dataCarousel[0] && (
            <div className="item">
              <img src={dataCarousel[0].url} alt="NOT_FOUND" />
              <div className="container-title">
                <h1>{dataCarousel[0].title}</h1>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

function fetchData$() {
  return ajax("/api/movies/carousel").pipe(pluck("response", "message"));
}
export default Carousel;
