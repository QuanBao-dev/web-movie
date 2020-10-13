import loadable from "@loadable/component";
import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
const LazyLoadAnimeList = loadable(
  () => import("../../components/LazyLoadAnimeList/LazyLoadAnimeList"),
  {
    fallback: <CircularProgress color="primary" size="7rem" />,
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
