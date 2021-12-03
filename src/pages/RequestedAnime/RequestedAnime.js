import "./RequestedAnime.css";

import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { fromEvent } from "rxjs";
import { ajax } from "rxjs/ajax";
import { debounceTime, pluck, filter } from "rxjs/operators";

import RequestedAnimeList from "../../components/RequestedAnimeList/RequestedAnimeList";

const RequestedAnime = () => {
  const [cookies] = useCookies(["idCartoonUser"]);
  const [requestedAnimeList, setRequestedAnimeList] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  console.log(maxPage);
  useEffect(() => {
    const subscription = fromEvent(window, "scroll")
      .pipe(
        debounceTime(500),
        filter(
          () =>
            document.body.scrollHeight - (window.scrollY + 1000) < 0 &&
            !isLoading
        )
      )
      .subscribe(() => {
        if (page + 1 > maxPage) {
          subscription.unsubscribe();
          return;
        }
        setPage(page + 1);
      });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, maxPage, isLoading]);
  useEffect(() => {
    setIsLoading(true);
    const subscription = ajax({
      url: `/api/movies/request?page=${page}`,
      method: "GET",
      headers: {
        authorization: `Bearer ${cookies.idCartoonUser}`,
      },
    })
      .pipe(pluck("response", "message"))
      .subscribe((res) => {
        if (!res.error) {
          setRequestedAnimeList([...requestedAnimeList, ...res.requestedAnime]);
          setMaxPage(res.maxPage);
          setIsLoading(false);
        }
      });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  return (
    <div>
      <RequestedAnimeList
        requestedAnimeList={requestedAnimeList}
        setRequestedAnimeList={setRequestedAnimeList}
      />
    </div>
  );
};

export default RequestedAnime;
