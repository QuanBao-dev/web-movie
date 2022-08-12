import "./AllAnimeRelated.css";

import loadable from "@loadable/component";
import React from "react";

const AnimeRelatedItem = loadable(() =>
  import("../AnimeRelatedItem/AnimeRelatedItem")
);
function AllAnimeRelated({ animeList, lazy = false }) {
  return (
    <div className="all-anime-related">
      {animeList &&
        animeList.map(({anime, role, type}, index) => (
          <AnimeRelatedItem
            anime={anime}
            role={role}
            key={index}
            lazy={lazy}
            type={type}
          />
        ))}
    </div>
  );
}

export default AllAnimeRelated;
