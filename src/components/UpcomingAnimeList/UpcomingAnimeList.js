import "./UpcomingAnimeList.css";

import React, { useEffect, useState } from "react";

import {
  scrollAnimeInterval$,
  scrollAnimeUser$,
  scrollAnimeUserStart$,
  stream,
  upcomingAnimeListUpdated$,
} from "../../epics/home";
import { updateModeScrolling } from "../../store/home";
import AnimeList from "../AnimeList/AnimeList";

const UpcomingAnimeList = () => {
  const length = stream.currentState().upcomingAnimeList.length || 0;
  const [listenAgain, setListenAgain] = useState(false);
  useEffect(() => {
    let subscription1, subscription2, subscription3;
    if (length !== 0) {
      const elementScroll = document.querySelector(".list-anime-nowrap");
      if (elementScroll) {
        const end = length - 7;
        subscription1 = scrollAnimeUser$(elementScroll, end).subscribe(() => {
          if (
            elementScroll.scrollLeft >= elementScroll.childNodes[end].offsetLeft
          ) {
            elementScroll.scroll({
              left:
                elementScroll.childNodes[end - parseInt(length / 2)].offsetLeft,
            });
            setListenAgain(!listenAgain);
          }
        });
        subscription3 = scrollAnimeUserStart$(elementScroll).subscribe(() => {
          if (elementScroll.scrollLeft === 0) {
            elementScroll.scroll({
              left: elementScroll.childNodes[parseInt(length / 2)].offsetLeft,
            });
            setListenAgain(!listenAgain);
          }
        });
        subscription2 = scrollAnimeInterval$(elementScroll, end).subscribe(
          () => {
            console.log("done");
            if (
              elementScroll.scrollLeft >=
              elementScroll.childNodes[end].offsetLeft
            ) {
              elementScroll.scroll({
                left:
                  elementScroll.childNodes[end - parseInt(length / 2)]
                    .offsetLeft,
              });
              setListenAgain(!listenAgain);
            }
          }
        );
      }
    }
    return () => {
      subscription1 && subscription1.unsubscribe();
      subscription2 && subscription2.unsubscribe();
      subscription3 && subscription3.unsubscribe();
    };
  }, [length, listenAgain]);
  useEffect(() => {
    stream.init();
    const subscription = upcomingAnimeListUpdated$().subscribe((data) => {
      stream.updateUpcomingAnimeList([
        ...data.slice(0, 25),
        ...data.slice(0, 25),
      ]);
    });
    return () => {
      updateModeScrolling("interval");
      subscription && subscription.unsubscribe();
      stream.updateIsFirstLaunch(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section
      className="upcoming-anime-container"
      onMouseEnter={() => {
        updateModeScrolling("enter");
      }}
      onMouseMove={() => {
        updateModeScrolling("enter");
      }}
      onMouseLeave={() => {
        updateModeScrolling("interval");
      }}
      onTouchMove={() => {
        updateModeScrolling("enter");
      }}
      onTouchStart={() => {
        updateModeScrolling("enter");
      }}
      onTouchEnd={() => {
        updateModeScrolling("interval");
      }}
      onTouchCancel={() => {
        updateModeScrolling("interval");
      }}
    >
      <h1 className="title-upcoming-anime">Upcoming anime</h1>
      <div className="control-scrolling">
        <div className="wrapper-control">
          <i
            className="fas fa-arrow-alt-circle-left fa-3x"
            onClick={() => {
              const elementScroll = document.querySelector(
                ".list-anime-nowrap"
              );
              if (elementScroll.scroll)
                elementScroll.scroll({
                  left:
                    elementScroll.scrollLeft -
                    elementScroll.childNodes[0].offsetWidth,
                  behavior: "smooth",
                });
            }}
          ></i>
          <i
            className="fas fa-arrow-alt-circle-right fa-3x"
            onClick={() => {
              const elementScroll = document.querySelector(
                ".list-anime-nowrap"
              );
              if (elementScroll.scroll)
                elementScroll.scroll({
                  left:
                    elementScroll.scrollLeft +
                    elementScroll.childNodes[0].offsetWidth,
                  behavior: "smooth",
                });
            }}
          ></i>
        </div>
      </div>
      <AnimeList
        empty={true}
        data={stream.currentState().upcomingAnimeList}
        isWrap={false}
        lazy={true}
        error={stream.currentState().error}
      />
    </section>
  );
};
export default UpcomingAnimeList;
