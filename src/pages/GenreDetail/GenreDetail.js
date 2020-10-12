import loadable from "@loadable/component";
import React from "react";
const LazyLoadAnimeList = loadable(() =>
  import("../../components/LazyLoadAnimeList/LazyLoadAnimeList")
);

const GenreDetail = (props) => {
  const { genreId } = props.match.params;
  return (
    <LazyLoadAnimeList
      genreId={genreId}
      url={"https://api.jikan.moe/v3/genre/anime/{genreId}/{page}"}
    />
  );
};

export default GenreDetail;
