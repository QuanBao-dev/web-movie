import React from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ajax } from "rxjs/ajax";
import "./RequestedAnimeItem.css";
const RequestedAnimeItem = ({
  requestedAnime,
  requestedAnimeList,
  setRequestedAnimeList,
}) => {
  const [cookies] = useCookies(["idCartoonUser"]);
  return (
    <div className="requested-anime-item-container">
      <i
        className="fas fa-trash fa-2x"
        onClick={() => {
          ajax({
            url: "/api/movies/request/" + requestedAnime.malId,
            method: "DELETE",
            headers: {
              authorization: `Bearer ${cookies.idCartoonUser}`,
            },
          }).subscribe((res) => {
            if (!res.error) {
              setRequestedAnimeList(
                requestedAnimeList.filter(
                  ({ malId }) => malId !== requestedAnime.malId
                )
              );
            }
          });
        }}
      ></i>
      <Link
        to={"/anime/" + requestedAnime.malId}
        className="link-requested-anime-item"
      >
        <div className="image-anime">
          <img src={requestedAnime.imageUrl} alt=""></img>
        </div>
        <div className="container-requested-anime-information">
          {Object.keys(requestedAnime)
            .filter((key) => key !== "imageUrl")
            .map((key) => (
              <div className="requested-anime-information-item" key={key}>
                <span>{key}:</span>{" "}
                {typeof requestedAnime[key] !== "object"
                  ? requestedAnime[key]
                  : requestedAnime[key].join(" | ")}
              </div>
            ))}
        </div>
      </Link>
    </div>
  );
};

export default RequestedAnimeItem;
