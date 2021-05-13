import './ListImageAnimeDetail.css';

import React, { useState } from 'react';

import SliderLargeImage from '../SliderLargeImage/SliderLargeImage';
import SliderSmallImage from '../SliderSmallImage/SliderSmallImage';

const ListImageAnimeDetail = ({ listImage }) => {
  const [page, setPage] = useState(0);
  return (
    <div className="list-image-anime-detail-container">
      <SliderLargeImage
        dataImageList={listImage}
        page={page}
        setPage={setPage}
      />
      <SliderSmallImage
        dataListImage={listImage}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default ListImageAnimeDetail;
