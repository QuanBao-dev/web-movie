import React, { useEffect } from "react";
import { ReplaySubject } from "rxjs";
import {
  scrollAnimeInterval$,
  stream,
  upcomingAnimeListUpdated$,
} from "../../epics/home";
import AnimeList from "../AnimeList/AnimeList";
import "./UpcomingAnimeList.css";
const UpcomingAnimeList = () => {
  useEffect(() => {
    const subscription = upcomingAnimeListUpdated$().subscribe((data) => {
      stream.updateUpcomingAnimeList(data);
    });
    const elementScroll = document.querySelector(".list-anime-nowrap");
    const subscription2 = scrollAnimeInterval$(elementScroll).subscribe((i) => {
      elementScroll.scroll({
        left: i,
        behavior: "smooth",
      });
    });
    return () => {
      subscription2.unsubscribe();
      subscription && subscription.unsubscribe();
    };
  }, []);
  return (
    <section>
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
