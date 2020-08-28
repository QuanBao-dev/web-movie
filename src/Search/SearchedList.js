import "./SearchedList.css";
import React, { useEffect, useState } from "react";
import { stream } from "../epics/home";
import Axios from "axios";
import AnimeList from "../components/AnimeList/AnimeList";

const SearchedList = (props) => {
  const key  = props.location.search.replace("?key=","");
  const { dataFilter } = stream.currentState();
  const [dataSearchedAnimeState, setDataSearchedAnimeState] = useState();
  useEffect(() => {
    if (dataFilter.length === 0) {
      fetchDataApi(key).then((data) => {
        setDataSearchedAnimeState(data.results);
      });
    } else {
      setDataSearchedAnimeState(dataFilter);
    }
    return () => {};
  }, [dataFilter, dataFilter.length, key]);
  // console.log(dataSearchedAnimeState);
  return (
    <div>
      <h1 style={{ color: "white" }}>Results searched for "{key}"</h1>
      {dataSearchedAnimeState && (
        <AnimeList
          data={dataSearchedAnimeState.filter((data) =>
            !["Rx"].includes(data.rated)
          )}
          error={null}
        />
      )}
    </div>
  );
};

async function fetchDataApi(text) {
  const data = await Axios.get(
    "https://api.jikan.moe/v3/search/anime?q=" + text
  );
  return data.data;
}

export default SearchedList;
