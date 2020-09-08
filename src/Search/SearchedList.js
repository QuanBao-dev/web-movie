import "./SearchedList.css";
import React, { useEffect, useState } from "react";
import { stream } from "../epics/home";
import AnimeList from "../components/AnimeList/AnimeList";
import { ajax } from "rxjs/ajax";
import { catchError, pluck, retry } from "rxjs/operators";
import { of } from "rxjs";

const SearchedList = (props) => {
  const key = props.location.search.replace("?key=", "");
  const { dataFilter } = stream.currentState();
  const [dataSearchedAnimeState, setDataSearchedAnimeState] = useState();
  useEffect(() => {
    let subscription;
    if (dataFilter.length === 0) {
      subscription = fetchDataApi$(key).subscribe((data) => {
        setDataSearchedAnimeState(data.results);
      });
    } else {
      setDataSearchedAnimeState(dataFilter);
    }
    return () => {
      subscription && subscription.unsubscribe();
    };
  }, [dataFilter, dataFilter.length, key]);
  // console.log(dataSearchedAnimeState);
  return (
    <div>
      <h1 style={{ color: "white" }}>Results searched for "{key}"</h1>
      {dataSearchedAnimeState && (
        <AnimeList
          data={dataSearchedAnimeState.filter(
            (data) => !["Rx"].includes(data.rated)
          )}
          error={null}
        />
      )}
    </div>
  );
};

function fetchDataApi$(text) {
  return ajax("https://api.jikan.moe/v3/search/anime?q=" + text).pipe(
    retry(20),
    pluck("response"),
    catchError(() => of({}))
  );
}

export default SearchedList;
