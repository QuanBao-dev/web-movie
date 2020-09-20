import React, { useEffect } from "react";
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
  useEffect(() => {
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
        if (Math.abs(distance) < 0.5) {
          forward = -1;
        } else if (elementScroll.scrollLeft === 0) {
          forward = 1;
        }
        elementScroll.scroll({
          left: scrollLeft + 3 * forward,
        });
      }
    );
    return () => {
      subscription2.unsubscribe();
      subscription && subscription.unsubscribe();
    };
  }, []);
  return (
    <section
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
        data={stream.currentState().upcomingAnimeList}
        isWrap={false}
        error={stream.currentState().error}
      />
    </section>
  );
};
export default UpcomingAnimeList;
