import React, { useEffect, useState } from "react";
import { of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { catchError, pluck, retry } from "rxjs/operators";
import AnimeList from "../AnimeList/AnimeList";

const RelatedAnime = ({ malId }) => {
  const [recommendationState,setRecommendationState] = useState([]);
  useEffect(() => {
    const subscription = fetchAnimeRecommendation$(malId).subscribe((data) => {
      setRecommendationState(data);
    })
    return () => {
      subscription.unsubscribe();
      setRecommendationState([]);
    }
  }, [malId]);
  return (
    recommendationState.length > 0 && <div>
      <h1 className="title">You might like...</h1>
      <AnimeList data={recommendationState} error={null} />
    </div>
  );
};

function fetchAnimeRecommendation$(malId) {
  return ajax({
    url: `https://api.jikan.moe/v3/anime/${malId}/recommendations`,
  }).pipe(
    retry(10),
    pluck("response","recommendations"),
    catchError(() => of([]))
  );
}

export default RelatedAnime;
