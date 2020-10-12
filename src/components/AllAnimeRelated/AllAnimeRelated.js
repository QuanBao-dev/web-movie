import "./AllAnimeRelated.css";

import loadable from "@loadable/component";
import React from "react";

const AnimeRelatedItem = loadable(() =>
  import("../AnimeRelatedItem/AnimeRelatedItem")
);
function AllAnimeRelated({ animeList, history, lazy = false }) {
  return (
    <div className="all-anime-related">
      {animeList &&
        animeList.map((anime, index) => (
          <AnimeRelatedItem
            anime={anime}
            key={index}
            history={history}
            lazy={lazy}
          />
        ))}
    </div>
  );
}

export default AllAnimeRelated;
