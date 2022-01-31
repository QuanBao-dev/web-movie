import React, { useRef, useState } from 'react';

import SliderLargeImage from '../SliderLargeImage/SliderLargeImage';
import SliderSmallImage from '../SliderSmallImage/SliderSmallImage';


const ListImageAnimeDetail = ({ listImage, isLoading }) => {
  const [page, setPage] = useState(1);
  const [triggerSlideSmallImage, setTriggerSlideSmallImage] = useState(false);
  const sliderLargeImageRef = useRef();
  return (
    <div className="list-image-anime-detail-container">
      <SliderLargeImage
        dataImageList={listImage}
        setPage={setPage}
        page={page}
        triggerSlideSmallImage={triggerSlideSmallImage}
        isLoading={isLoading}
      />
      <SliderSmallImage
        sliderLargeImageRef={sliderLargeImageRef}
        dataImageList={listImage}
        page={page}
        setPage={setPage}
        triggerSlideSmallImage={triggerSlideSmallImage}
        setTriggerSlideSmallImage={setTriggerSlideSmallImage}
      />
    </div>
  );
};

export default ListImageAnimeDetail;
