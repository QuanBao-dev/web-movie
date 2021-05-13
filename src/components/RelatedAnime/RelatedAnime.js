/* eslint-disable react-hooks/exhaustive-deps */
import "./RelatedAnime.css";
import "react-lazy-load-image-component/src/effects/opacity.css";

import React, { useEffect, useRef, useState } from "react";

import { animeDetailStream } from "../../epics/animeDetail";
import AnimeList from "../AnimeList/AnimeList";
import CircularProgress from "@material-ui/core/CircularProgress";

const RelatedAnime = ({ isLoading }) => {
  const [recommendationState, setRecommendationState] = useState(
    animeDetailStream.currentState() || animeDetailStream.initialState
  );
  const buttonRef = useRef();
  useEffect(() => {
    const subscription = animeDetailStream.subscribe(setRecommendationState);
    animeDetailStream.init();
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (buttonRef.current) {
      if (
        recommendationState.dataRelatedAnime.length >
        10 * recommendationState.pageRelated
      ) {
        buttonRef.current.style.display = "block";
      } else {
        buttonRef.current.style.display = "none";
      }
    }
  }, [
    recommendationState.pageRelated,
    recommendationState.dataRelatedAnime.length,
  ]);
  return (
    recommendationState.dataRelatedAnime.length > 0 && (
      <div>
        <h1 className="title">You might like...</h1>
        {isLoading !== null && isLoading === true && (
          <CircularProgress color="secondary" size="4rem" />
        )}
        {isLoading === false && (
          <div>
            <AnimeList
              data={recommendationState.dataRelatedAnime.slice(
                0,
                10 * recommendationState.pageRelated
              )}
              error={null}
              lazy={true}
            />
            <div
              className="see-more-movie"
              ref={buttonRef}
              onClick={() => {
                animeDetailStream.updateData({
                  pageRelated: animeDetailStream.currentState().pageRelated + 1,
                });
              }}
            >
              See more
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default RelatedAnime;
