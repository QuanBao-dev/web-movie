import "./CarouselItem.css";
import "react-lazy-load-image-component/src/effects/opacity.css";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

function CarouselItem({ data }) {
  return (
    <Link
      to={`/anime/${data.malId || data.mal_id}-${data.title
        .replace(/[ /%^&*():.$]/g, "-")
        .toLocaleLowerCase()}`}
      className="item"
    >
      <LazyLoadImage src={data.url} alt="NOT_FOUND" effect="opacity" />
      <div className="container-title">
        <h1>{data.title}</h1>
      </div>
    </Link>
  );
}

export default CarouselItem;
