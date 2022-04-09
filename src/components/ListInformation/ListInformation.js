import CircularProgress from "@material-ui/core/CircularProgress";
import React from "react";
import { Link } from "react-router-dom";
import { animeDetailStream, capitalizeString } from "../../epics/animeDetail";

const dataLinkList = [
  { name: "explicit_genres", route: "?genre=" },
  { name: "genres", route: "?genres=" },
  { name: "producers", route: "?producers=" },
  { name: "licensors", route: "?producers=" },
  { name: "studios", route: "?producers=" },
  { name: "themes", route: "?genres=" },
  { name: "demographics", route: "?genres=" },
  { name: "serializations", route: "?magazines=" },
];
function ListInformation({ arrKeys, isLoading, type }) {
  return (
    <ul>
      {isLoading !== null && isLoading === true && (
        <CircularProgress color="secondary" size="4rem" />
      )}
      {isLoading === false &&
        arrKeys &&
        arrKeys.map((v, index) => {
          if (
            typeof animeDetailStream.currentState().dataInformationAnime[v] !==
            "object"
          ) {
            if (v !== "rank" && v !== "popularity" && v !== "score")
              return (
                <li key={index} style={{ lineHeight: "2.3rem" }}>
                  <span
                    style={{
                      fontFamily: "Arial",
                      padding: "8px",
                      backgroundColor: "#353940",
                      borderRadius: "10px",
                    }}
                  >
                    {capitalizeString(v)}:
                  </span>{" "}
                  {`${
                    animeDetailStream.currentState().dataInformationAnime[v]
                  }`}
                </li>
              );
            else
              return (
                <li key={index} style={{ lineHeight: "2.3rem" }}>
                  <span
                    style={{
                      fontFamily: "Arial",
                      padding: "8px",
                      backgroundColor: "#353940",
                      borderRadius: "10px",
                    }}
                  >
                    {capitalizeString(v)}:
                  </span>{" "}
                  <span
                    style={
                      v === "rank"
                        ? {
                            color:
                              animeDetailStream.currentState()
                                .dataInformationAnime[v] <= 500
                                ? "Yellow"
                                : animeDetailStream.currentState()
                                    .dataInformationAnime[v] <= 3000
                                ? "#8b8bff"
                                : "inherit",
                          }
                        : v === "popularity"
                        ? {
                            color:
                              animeDetailStream.currentState()
                                .dataInformationAnime[v] <= 1000
                                ? "Yellow"
                                : animeDetailStream.currentState()
                                    .dataInformationAnime[v] <= 2000
                                ? "#8b8bff"
                                : "inherit",
                          }
                        : v === "score"
                        ? {
                            color:
                              animeDetailStream.currentState()
                                .dataInformationAnime[v] >= 8
                                ? "Yellow"
                                : animeDetailStream.currentState()
                                    .dataInformationAnime[v] >= 6
                                ? "#8b8bff"
                                : "inherit",
                          }
                        : {}
                    }
                  >
                    {`${
                      animeDetailStream.currentState().dataInformationAnime[v]
                    }`}
                  </span>
                </li>
              );
          }

          if (
            animeDetailStream.currentState().dataInformationAnime[v] &&
            animeDetailStream.currentState().dataInformationAnime[v].length
          ) {
            let isNotContainedObject = true;
            animeDetailStream
              .currentState()
              .dataInformationAnime[v].forEach((anime) => {
                if (typeof anime === "object") {
                  isNotContainedObject = false;
                }
              });
            if (!isNotContainedObject) {
              const array =
                animeDetailStream.currentState().dataInformationAnime[v];
              return (
                <li key={index}>
                  <ul className="title-synonym-list">
                    <span className="title-capitalize">
                      {capitalizeString(v)}
                    </span>
                    {array.map((anime, index) => {
                      if (v === "authors") {
                        return (
                          <Link to={"/person/" + anime.mal_id} key={index}>
                            <li className="click-able-info" key={index}>
                              {anime.name.replace(",", "")}
                            </li>
                          </Link>
                        );
                      }
                      if (v === "external_links") {
                        return (
                          <a
                            key={index}
                            href={anime.url}
                            target={"_blank"}
                            rel={"noopener noreferrer"}
                            style={{
                              textTransform: "capitalize",
                            }}
                          >
                            <li className="click-able-info">
                              {anime.name.length
                                ? anime.name
                                : anime.url
                                    .replace("https://", "")
                                    .replace(/\/[a-z/A-Z_(!@#$%^&*)]+/g, "")
                                    .replace(/\./g, " ")}
                            </li>
                          </a>
                        );
                      }
                      for (let i = 0; i < dataLinkList.length; i++) {
                        const { name, route } = dataLinkList[i];
                        if (v === name) {
                          return (
                            <Link
                              key={index}
                              to={`/storage/vertical${route}${anime.mal_id}&${type}`}
                            >
                              <li className="click-able-info">{anime.name}</li>
                            </Link>
                          );
                        }
                      }
                      return <li key={index}>{anime.name}</li>;
                    })}
                  </ul>
                </li>
              );
            }
            return (
              <li key={index}>
                <ul className="title-synonym-list">
                  <span className="title-capitalize">
                    {v.replace("_", " ")}
                  </span>
                  {animeDetailStream
                    .currentState()
                    .dataInformationAnime[v].map((anime, key) => {
                      return <li key={key}>{anime}</li>;
                    })}
                </ul>
              </li>
            );
          }
          if (
            animeDetailStream.currentState().dataInformationAnime[v] &&
            animeDetailStream.currentState().dataInformationAnime[v].length !==
              0
          ) {
            if (v === "related") {
              const related =
                animeDetailStream.currentState().dataInformationAnime[v];
              return Object.keys(related).map((key) => (
                <li key={key}>
                  <ul className="title-synonym-list">
                    <span className="title-capitalize">
                      {capitalizeString(key)}
                    </span>
                    {related[key].map((anime, index) => {
                      return (
                        <Link
                          key={index}
                          to={
                            `/${type}/` +
                            anime.mal_id +
                            "-" +
                            anime.name
                              .replace(/[ /%^&*():.$,]/g, "-")
                              .toLocaleLowerCase()
                          }
                        >
                          <li className={"click-able-info"}>
                            {anime.name}{" "}
                            {anime.type !== "anime" && (
                              <span>({capitalizeString(anime.type)})</span>
                            )}
                          </li>
                        </Link>
                      );
                    })}
                  </ul>
                </li>
              ));
            }
            if (v === "aired") {
              const aired =
                animeDetailStream.currentState().dataInformationAnime[v];
              return (
                <li style={{ lineHeight: "2.3rem" }} key={index}>
                  <span
                    style={{
                      fontFamily: "Arial",
                      padding: "10px",
                      backgroundColor: "rgb(53, 57, 64)",
                      borderRadius: "10px",
                      textTransform: "capitalize",
                    }}
                  >
                    {v}
                  </span>{" "}
                  {aired.string ? aired.string : "Unknown"}
                </li>
              );
            }
          }
          return undefined;
        })}
    </ul>
  );
}

export default ListInformation;
