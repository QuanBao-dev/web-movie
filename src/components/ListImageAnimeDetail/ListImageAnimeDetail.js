import React, { useRef, useState } from 'react';

import SliderLargeImage from '../SliderLargeImage/SliderLargeImage';
import SliderSmallImage from '../SliderSmallImage/SliderSmallImage';


const ListImageAnimeDetail = ({ listImage, isLoading }) => {
  const [page, setPage] = useState(0);
  const sliderLargeImageRef = useRef();
  return (
    <div className="list-image-anime-detail-container">
      <SliderLargeImage
        sliderLargeImageRef={sliderLargeImageRef}
        dataImageList={listImage}
        page={page}
        setPage={setPage}
        isLoading={isLoading}
      />
      <SliderSmallImage
        sliderLargeImageRef={sliderLargeImageRef}
        dataListImage={listImage}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default ListImageAnimeDetail;
