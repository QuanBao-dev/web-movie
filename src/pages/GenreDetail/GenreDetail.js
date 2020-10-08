import React, { Suspense } from "react";
const LazyLoadAnimeList = React.lazy(() =>
  import("../../components/LazyLoadAnimeList/LazyLoadAnimeList")
);

const GenreDetail = (props) => {
  const { genreId } = props.match.params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyLoadAnimeList
        genreId={genreId}
        url={"https://api.jikan.moe/v3/genre/anime/{genreId}/{page}"}
      />
    </Suspense>
  );
};

export default GenreDetail;
