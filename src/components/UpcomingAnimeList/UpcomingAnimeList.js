import "./UpcomingAnimeList.css";

import React, { useState } from "react";

import { scrollAnimeUser$ } from "../../epics/upcomingAnimeList";
import { upcomingAnimeListStream } from "../../epics/upcomingAnimeList";
import {
  useFetchUpcomingAnimeList,
  useKeepDragMoveAnimeList,
  useInitUpcomingAnimeList,
} from "../../Hook/upcomingAnimeList";
import AnimeList from "../AnimeList/AnimeList";

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
        lazy={true}
        empty={true}
        data={upcomingAnimeListState.upcomingAnimeList}
        isWrap={false}
      />
    </section>
  );
};
function scrollByTranslate(distance, forward = 1, elementScroll) {
  if (upcomingAnimeListStream.currentState().shouldScrollLeft)
    scrollAnimeUser$(distance, elementScroll, forward, numberList).subscribe();
}

export default UpcomingAnimeList;
