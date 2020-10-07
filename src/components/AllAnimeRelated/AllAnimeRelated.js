import "./AllAnimeRelated.css";
import React, { Suspense } from "react";
const AnimeRelatedItem = React.lazy(() =>
  import("../AnimeRelatedItem/AnimeRelatedItem")
);
function AllAnimeRelated({ animeList, history }) {
  return (
    <div className="all-anime-related">
      {animeList &&
        animeList.map((anime, index) => (
          <Suspense key={index} fallback={<div>Loading...</div>}>
            <AnimeRelatedItem anime={anime} key={index} history={history} />
          </Suspense>
        ))}
    </div>
  );
}

export default AllAnimeRelated;
