/* eslint-disable react-hooks/exhaustive-deps */
import "./RelatedAnime.css";
import React, { useEffect, useRef, useState } from "react";
import { of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { catchError, pluck, retry } from "rxjs/operators";
import AnimeList from "../AnimeList/AnimeList";

const RelatedAnime = ({ malId }) => {
  const [recommendationState, setRecommendationState] = useState([]);
  const [pageDisplayRelatedAnime, setPageDisplayRelatedAnime] = useState(1);
  const buttonRef = useRef();
  useEffect(() => {
    const subscription = fetchAnimeRecommendation$(malId).subscribe((data) => {
      setRecommendationState(data);
    });
    return () => {
      subscription.unsubscribe();
      setRecommendationState([]);
    };
  }, [malId]);
  useEffect(() => {
    if (buttonRef.current) {
      if(recommendationState.length > 10 * pageDisplayRelatedAnime){
        buttonRef.current.style.display = "block";
      } else {
        buttonRef.current.style.display = "none";
      }
    }
  }, [pageDisplayRelatedAnime,recommendationState.length]);
  return (
    recommendationState.length > 0 && (
      <div>
        <h1 className="title">You might like...</h1>
        <AnimeList
          data={recommendationState.slice(0, 10 * pageDisplayRelatedAnime)}
          error={null}
        />
        <button
          className="see-more-movie"
          ref={buttonRef}
          onClick={(e) => {
            e.target.scrollIntoView({
              block: "end",
              inline: "nearest",
            })
            const current = pageDisplayRelatedAnime;
            setPageDisplayRelatedAnime(current + 1);
          }}
        >
          See more
        </button>
      </div>
    )
  );
};

function fetchAnimeRecommendation$(malId) {
  return ajax({
    url: `https://api.jikan.moe/v3/anime/${malId}/recommendations`,
  }).pipe(
    retry(10),
    pluck("response", "recommendations"),
    catchError(() => of([]))
  );
}

export default RelatedAnime;
