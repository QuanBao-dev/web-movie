import "./UpcomingAnimeList.css";

import React, { Suspense, useEffect } from "react";

import {
  scrollAnimeInterval$,
  stream,
  upcomingAnimeListUpdated$,
} from "../../epics/home";
import { updateModeScrolling } from "../../store/home";
const AnimeList = React.lazy(() => import("../AnimeList/AnimeList"));

let forward = 1;
const UpcomingAnimeList = () => {
  useEffect(() => {
    stream.init();
    const subscription = upcomingAnimeListUpdated$().subscribe((data) => {
      stream.updateUpcomingAnimeList(data);
    });
    const elementScroll = document.querySelector(".list-anime-nowrap");
    let subscription2;
    if (elementScroll) {
      subscription2 = scrollAnimeInterval$(elementScroll).subscribe(
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
          }

          elementScroll.scroll({
            left: scrollLeft + 2.4 * forward,
          });
        }
      );
    }
    return () => {
      subscription2 && subscription2.unsubscribe();
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
      <Suspense>
        <AnimeList
          data={stream.currentState().upcomingAnimeList}
          isWrap={false}
          lazy={true}
          error={stream.currentState().error}
        />
      </Suspense>
    </section>
  );
};
export default UpcomingAnimeList;
