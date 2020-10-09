import React, { useEffect, useState } from "react";
import {
  scrollAnimeInterval$,
  stream,
  upcomingAnimeListUpdated$,
} from "../../epics/home";
import { updateModeScrolling } from "../../store/home";
import AnimeList from "../AnimeList/AnimeList";
import "./UpcomingAnimeList.css";
let forward = 1;
const UpcomingAnimeList = () => {
  const [homeState, setHomeState] = useState(stream.initialState);
  useEffect(() => {
    const elementScroll = document.querySelector(".list-anime-nowrap");
    const subscription = scrollAnimeInterval$(elementScroll).subscribe(() => {
      const distance =
        elementScroll.scrollLeft +
        elementScroll.clientWidth -
        elementScroll.scrollWidth;
      if (Math.abs(distance) < 100) {
        if (
          stream.currentState().upcomingAnimeList.length >
          stream.currentState().pageSplit * 8
        )
          stream.updatePageSplit(homeState.pageSplit + 1);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [homeState.pageSplit]);
  useEffect(() => {
    const subscriptionInit = stream.subscribe(setHomeState);
    stream.init();
    const subscription = upcomingAnimeListUpdated$().subscribe((data) => {
      stream.updateUpcomingAnimeList(data);
    });
    const elementScroll = document.querySelector(".list-anime-nowrap");
    const subscription2 = scrollAnimeInterval$(elementScroll).subscribe(
      (scrollLeft) => {
        const distance =
          elementScroll.scrollLeft +
          elementScroll.clientWidth -
          elementScroll.scrollWidth;
        if (
          stream.currentState().upcomingAnimeList.length <
          stream.currentState().pageSplit * 8
        ) {
          if (Math.abs(distance) < 0.5) {
            setTimeout(() => {
              forward = -1;
            }, 3000);
          } else if (elementScroll.scrollLeft === 0) {
            setTimeout(() => {
              forward = 1;
            }, 3000);
          }
        } else {
        }
        elementScroll.scroll({
          left: scrollLeft + 2.4 * forward,
        });
      }
    );
    return () => {
      subscriptionInit.unsubscribe();
      subscription2.unsubscribe();
      subscription && subscription.unsubscribe();
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
      <AnimeList
        data={stream
          .currentState()
          .upcomingAnimeList.slice(0, homeState.pageSplit * 8)}
        isWrap={false}
        error={stream.currentState().error}
      />
    </section>
  );
};
export default UpcomingAnimeList;
