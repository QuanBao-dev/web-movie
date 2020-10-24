import "./UpcomingAnimeList.css";

import React, { useEffect } from "react";

import {
  scrollAnimeInterval$,
  scrollAnimeUser$,
  stream,
  upcomingAnimeListUpdated$,
} from "../../epics/home";
import { updateModeScrolling } from "../../store/home";
import AnimeList from "../AnimeList/AnimeList";

let numberList = 50;
let numberCloneList = 8;
const UpcomingAnimeList = () => {
  const length = stream.currentState().upcomingAnimeList.length || 0;
  useEffect(() => {
    let subscription2;
    if (length !== 0) {
      const elementScroll = document.querySelector(".list-anime-nowrap");
      if (elementScroll) {
        const end = length - 7;
        subscription2 = scrollAnimeInterval$(
          elementScroll,
          end,
          numberList
        ).subscribe(() => {
          stream.updateOffsetLeft(
            -elementScroll.childNodes[end - numberList].offsetLeft
          );
          elementScroll.style.transition = "0s";
          elementScroll.style.transform = `translateX(${
            stream.currentState().offsetLeft
          })`;
        });
      }
    }
    return () => {
      subscription2 && subscription2.unsubscribe();
    };
  }, [length]);
  useEffect(() => {
    stream.init();
    const subscription = upcomingAnimeListUpdated$().subscribe((data) => {
      stream.updateUpcomingAnimeList([
        ...data.slice(0, numberList),
        ...data.slice(0, numberCloneList),
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
              scrollByTranslate(
                elementScroll.childNodes[0].offsetWidth,
                -1,
                elementScroll
              );
            }}
          ></i>
          <i
            className="fas fa-arrow-alt-circle-right fa-3x"
            onClick={() => {
              const elementScroll = document.querySelector(
                ".list-anime-nowrap"
              );
              scrollByTranslate(
                elementScroll.childNodes[0].offsetWidth,
                1,
                elementScroll
              );
            }}
          ></i>
        </div>
      </div>

      <AnimeList
        empty={true}
        data={stream.currentState().upcomingAnimeList}
        isWrap={false}
        error={stream.currentState().error}
      />
    </section>
  );
};
function scrollByTranslate(distance, forward = 1, elementScroll) {
  if (stream.currentState().shouldScrollLeft)
    scrollAnimeUser$(distance, elementScroll, forward, numberList).subscribe();
}

export default UpcomingAnimeList;
