import './CarouselItem.css';

import React from 'react';

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
      <img src={data.url} alt="NOT_FOUND" />
      <div className="container-title">
        <h1>{data.title}</h1>
      </div>
    </div>
  );
}

export default CarouselItem;
