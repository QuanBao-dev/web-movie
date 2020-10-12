import loadable from "@loadable/component";
import React from "react";
const LazyLoadAnimeList = loadable(
  () => import("../../components/LazyLoadAnimeList/LazyLoadAnimeList"),
  {
    fallback: <i class="fas fa-spinner"></i>,
  }
);

const ProducerDetail = (props) => {
  const { producerId } = props.match.params;
  return (
    <LazyLoadAnimeList
      genreId={producerId}
      url={"https://api.jikan.moe/v3/producer/{genreId}/{page}"}
    />
  );
};

export default ProducerDetail;
