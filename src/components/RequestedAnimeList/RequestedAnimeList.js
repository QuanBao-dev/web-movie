import React from "react";
import RequestedAnimeItem from "../RequestedAnimeItem/RequestedAnimeItem";
import "./RequestedAnimeList.css";
const RequestedAnimeList = ({ requestedAnimeList, setRequestedAnimeList }) => {
  return (
    <div className="requested-anime-list-container">
      {requestedAnimeList.map((requestedAnime) => (
        <RequestedAnimeItem
          requestedAnime={requestedAnime}
          key={requestedAnimeList.malId}
          requestedAnimeList={requestedAnimeList}
          setRequestedAnimeList={setRequestedAnimeList}
        />
      ))}
    </div>
  );
};

export default RequestedAnimeList;
