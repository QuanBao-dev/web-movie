import loadable from "@loadable/component";
import React from "react";
const LazyLoadAnimeList = loadable(
  () => import("../../components/LazyLoadAnimeList/LazyLoadAnimeList"),
  {
    fallback: (
      <div style={{ textAlign: "center" }}>
        <i className="fas fa-spinner fa-9x fa-spin"></i>
      </div>
    ),
  }
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
