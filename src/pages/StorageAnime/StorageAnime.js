import "./StorageAnime.css";

import loadable from "@loadable/component";
import { LinearProgress } from "@material-ui/core";
import React from "react";
const FilterAnime = loadable(
  () => import("../../components/FilterAnime/FilterAnime"),
  {
    fallback: (
      <section style={{ position: "fixed", width: "100%", zIndex: "2000" }}>
        <LinearProgress color="secondary" />
      </section>
    ),
  }
);

const StorageAnimeList = loadable(
  () => import("../../components/StorageAnimeList/StorageAnimeList"),
  {
    fallback: (
      <section style={{ position: "fixed", width: "100%", zIndex: "2000" }}>
        <LinearProgress color="secondary" />
      </section>
    ),
  }
);

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
