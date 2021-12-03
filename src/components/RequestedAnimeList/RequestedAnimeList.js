import React from "react";
import RequestedAnimeItem from "../RequestedAnimeItem/RequestedAnimeItem";
import "./RequestedAnimeList.css";
const RequestedAnimeList = ({ requestedAnimeList, setRequestedAnimeList }) => {
  return (
    <div className="requested-anime-list-container">
      {requestedAnimeList.map((requestedAnime, key) => (
        <RequestedAnimeItem
          requestedAnime={requestedAnime}
          key={key}
          requestedAnimeList={requestedAnimeList}
          setRequestedAnimeList={setRequestedAnimeList}
        />
      ))}
    </div>
  );
};

export default RequestedAnimeList;
