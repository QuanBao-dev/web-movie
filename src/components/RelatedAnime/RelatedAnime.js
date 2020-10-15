/* eslint-disable react-hooks/exhaustive-deps */
import './RelatedAnime.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';

import React, { useEffect, useRef, useState } from 'react';

import { nameStream } from '../../epics/name';
import AnimeList from '../AnimeList/AnimeList';

const RelatedAnime = () => {
  const [recommendationState, setRecommendationState] = useState(
    nameStream.currentState() || nameStream.initialState
  );
  const buttonRef = useRef();
  useEffect(() => {
    const subscription = nameStream.subscribe(setRecommendationState);
    nameStream.init();
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
        <AnimeList
          data={recommendationState.dataRelatedAnime.slice(
            0,
            8 * recommendationState.pageRelated
          )}
          error={null}
          lazy={true}
        />
        <div
          className="see-more-movie"
          ref={buttonRef}
          onClick={() => {
            nameStream.updatePageRelated(
              nameStream.currentState().pageRelated + 1
            );
          }}
        >
          See more
        </div>
      </div>
    )
  );
};


export default RelatedAnime;
