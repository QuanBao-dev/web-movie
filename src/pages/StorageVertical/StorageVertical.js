/* eslint-disable no-useless-escape */
import loadable from "@loadable/component";
import CircularProgress from "@material-ui/core/CircularProgress";
import React from "react";

const LazyLoadAnimeList = loadable(
  () => import("../../components/LazyLoadAnimeList/LazyLoadAnimeList"),
  {
    fallback: <CircularProgress color="primary" size="7rem" />,
  }
);

const StorageVertical = (props) => {
  const query = props.location.search;
  const searchBy = query.match(/anime|characters|people|manga/g)
    ? query.match(/anime|characters|people|manga/g)[0]
    : "anime";
  return (
    <LazyLoadAnimeList
      url={`https://api.jikan.moe/v4/${searchBy}?page={page}&${query
        .replace(/(&)?page=[0-9]+/g, "")
        .replace("?", "")}`.replace(/&&/g, "&")}
      query={query}
      title={"Filter"}
      searchBy={searchBy}
    />
  );
};

export default StorageVertical;
