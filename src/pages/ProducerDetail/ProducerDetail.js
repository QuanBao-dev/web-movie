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
  const type = props.match.path.split("/")[1];
  return (
    <LazyLoadAnimeList
      genreId={producerId}
      url={`https://api.jikan.moe/v4/anime?${type}s={genreId}&page={page}`}
      type={producerId.split("-").slice(1).join(" ")}
    />
  );
};

export default ProducerDetail;
