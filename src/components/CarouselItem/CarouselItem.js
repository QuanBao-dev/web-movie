import './CarouselItem.css';
import "react-lazy-load-image-component/src/effects/opacity.css"
import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

function CarouselItem({ data, history }) {
  return (
    <div
      className="item"
      onClick={() => {
        if (data.malId) {
          history.push("/anime/" + data.malId);
        } else {
          history.push(`/anime/search?key=${data.title}`);
        }
      }}
    >
      <LazyLoadImage src={data.url} alt="NOT_FOUND" effect="opacity"/>
      <div className="container-title">
        <h1>{data.title}</h1>
      </div>
    </div>
  );
}

export default CarouselItem;
