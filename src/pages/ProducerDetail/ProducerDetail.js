import React, { Suspense } from "react";
const LazyLoadAnimeList = React.lazy(() =>
  import("../../components/LazyLoadAnimeList/LazyLoadAnimeList")
);

const ProducerDetail = (props) => {
  const { producerId } = props.match.params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyLoadAnimeList
        genreId={producerId}
        url={"https://api.jikan.moe/v3/producer/{genreId}/{page}"}
      />
    </Suspense>
  );
};

export default ProducerDetail;
