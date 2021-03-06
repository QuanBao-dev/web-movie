import "./UpcomingAnimeList.css";

import React, { useEffect, useState } from "react";

import { scrollAnimeUser$ } from "../../epics/upcomingAnimeList";
import { upcomingAnimeListStream } from "../../epics/upcomingAnimeList";
import {
  useFetchUpcomingAnimeList,
  useKeepDragMoveAnimeList,
  useInitUpcomingAnimeList,
} from "../../Hook/upcomingAnimeList";
import AnimeList from "../AnimeList/AnimeList";
import { fromEvent } from "rxjs";
import { debounceTime } from "rxjs/operators";

let numberList = 50;
let numberCloneList = 8;
const UpcomingAnimeList = () => {
  const length =
    upcomingAnimeListStream.currentState().upcomingAnimeList.length || 0;
  const [upcomingAnimeListState, setUpcomingAnimeListState] = useState(
    upcomingAnimeListStream.currentState()
  );
  useInitUpcomingAnimeList(setUpcomingAnimeListState);
  useKeepDragMoveAnimeList(length, numberList);
  useFetchUpcomingAnimeList(numberList, numberCloneList);
  useEffect(() => {
    const subscription = fromEvent(window, "resize")
      .pipe(debounceTime(200))
      .subscribe(() => {
        upcomingAnimeListStream.updateData({ screenWidth: window.innerWidth });
      });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return (
    <section
      className="upcoming-anime-container"
      onTouchMove={() => {
        // updateModeScrolling("enter");
        upcomingAnimeListStream.updateDataQuick({
          modeScrolling: "enter",
        });
      }}
      onTouchStart={() => {
        // updateModeScrolling("enter");
        upcomingAnimeListStream.updateDataQuick({
          modeScrolling: "enter",
        });
      }}
      onTouchEnd={() => {
        // updateModeScrolling("interval");
        upcomingAnimeListStream.updateDataQuick({
          modeScrolling: "interval",
        });
      }}
      onTouchCancel={() => {
        // updateModeScrolling("interval");
        upcomingAnimeListStream.updateDataQuick({
          modeScrolling: "interval",
        });
      }}
    >
      <div className="container-upcoming-anime-main">
        <h1 className="title-upcoming-anime">Upcoming anime</h1>
        {upcomingAnimeListState.screenWidth >= 700 && (
          <i
            className="button-scrolling left fas fa-arrow-alt-circle-left fa-3x"
            onClick={() => {
              const elementScroll =
                document.querySelector(".list-anime-nowrap");
              scrollByTranslate(
                elementScroll.childNodes[0].offsetWidth,
                -1,
                elementScroll
              );
            }}
          ></i>
        )}
        {upcomingAnimeListState.screenWidth >= 700 && (
          <i
            className="button-scrolling right fas fa-arrow-alt-circle-right fa-3x"
            onClick={() => {
              const elementScroll =
                document.querySelector(".list-anime-nowrap");
              scrollByTranslate(
                elementScroll.childNodes[0].offsetWidth,
                1,
                elementScroll
              );
            }}
          ></i>
        )}

        <AnimeList
          lazy={true}
          empty={true}
          data={upcomingAnimeListState.upcomingAnimeList}
          isWrap={false}
        />
      </div>
    </section>
  );
};
function scrollByTranslate(distance, forward = 1, elementScroll) {
  if (upcomingAnimeListStream.currentState().shouldScrollLeft)
    scrollAnimeUser$(distance, elementScroll, forward, numberList).subscribe();
}

export default UpcomingAnimeList;
