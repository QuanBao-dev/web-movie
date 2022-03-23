import "./StorageAnime.css";

import React from "react";
import FilterAnime from "../../components/FilterAnime/FilterAnime";
import StorageAnimeList from "../../components/StorageAnimeList/StorageAnimeList";
const StorageAnime = (props) => {
  const query = props.location.search;
  return (
    <div className="storage-anime-container">
      <FilterAnime />
      <StorageAnimeList query={query} />
    </div>
  );
};

export default StorageAnime;
