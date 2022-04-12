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
  const searchBy = (
    query.match(/&(characters|people|manga|latest|box)/g)
      ? query.match(/&(characters|people|manga|latest|box)/g)[0]
      : "&anime"
  ).replace("&", "");
  return (
    <LazyLoadAnimeList
      url={
        ![ "latest","box"].includes(searchBy)
          ? `https://api.jikan.moe/v4/${searchBy.replace(
              "&",
              ""
            )}?page={page}&${query
              .replace(/(&)?page=[0-9]+/g, "")
              .replace("?", "")}`
              .replace(/&&/g, "&")
              .replace(/&$/g, "")
          : `/api/movies/${searchBy}?page={page}`
      }
      query={query}
      title={"Filter"}
      searchBy={searchBy}
    />
  );
};

export default StorageVertical;
