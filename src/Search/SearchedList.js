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
    subscription = fetchDataApi$(key).subscribe((data) => {
      setDataSearchedAnimeState(data.results);
    });
    return () => {
      subscription && subscription.unsubscribe();
    };
  }, [dataFilter, dataFilter.length, key]);
  // console.log(dataSearchedAnimeState);
  let dataSearchDisplay;
  if (dataSearchedAnimeState)
    dataSearchDisplay = dataSearchedAnimeState.filter(
      (data) => !["Rx"].includes(data.rated)
    );
  return (
    <div>
      <h1 style={{ color: "white" }}>Results searched for "{key}"</h1>
      {dataSearchDisplay && <AnimeList data={dataSearchDisplay} error={null} />}
      {dataSearchDisplay && dataSearchDisplay.length === 0 && (
        <h4 style={{ color: "white" }}>
          Not found any anime. Make sure your key search at least has 3
          characters
        </h4>
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
