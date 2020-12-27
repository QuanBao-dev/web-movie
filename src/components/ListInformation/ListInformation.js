import { CircularProgress } from "@material-ui/core";
import React from "react";
import { animeDetailStream, capitalizeString } from "../../epics/animeDetail";
function ListInformation({ arrKeys, history, isLoading }) {
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
            if (v !== "rank")
              return (
                <li key={index} style={{ lineHeight: "2.3rem" }}>
                  <span
                    style={{
                      fontFamily: "Arial",
                      padding: "10px",
                      backgroundColor: "#353940",
                      borderRadius: "10px",
                    }}
                  >
                    {capitalizeString(v)}
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
                      padding: "10px",
                      backgroundColor: "#353940",
                      borderRadius: "10px",
                    }}
                  >
                    {capitalizeString(v)}
                  </span>{" "}
                  <span
                    style={{
                      color:
                        animeDetailStream.currentState().dataInformationAnime[
                          v
                        ] <= 1000
                          ? "Yellow"
                          : animeDetailStream.currentState()
                              .dataInformationAnime[v] <= 2000
                          ? "#8b8bff"
                          : "inherit",
                    }}
                  >
                    {`${
                      animeDetailStream.currentState().dataInformationAnime[v]
                    }`}
                  </span>
                </li>
              );
          } else {
            if (
              animeDetailStream.currentState().dataInformationAnime[v] &&
              animeDetailStream.currentState().dataInformationAnime[v].length
            ) {
              let check = true;
              animeDetailStream
                .currentState()
                .dataInformationAnime[v].forEach((anime) => {
                  if (typeof anime === "object") {
                    check = false;
                  }
                });
              if (!check) {
                const array = animeDetailStream.currentState()
                  .dataInformationAnime[v];
                return (
                  <li key={index}>
                    <ul className="title-synonym-list">
                      <span className="title-capitalize">
                        {capitalizeString(v)}
                      </span>
                      {array.map((anime, index) => {
                        return (
                          <li
                            className={
                              v === "genres" ||
                              v === "producers" ||
                              v === "studios" ||
                              v === "licensors"
                                ? "click-able-info"
                                : ""
                            }
                            key={index}
                            onClick={() => {
                              if (v === "genres") {
                                history.push(
                                  "/genre/" +
                                    anime.mal_id +
                                    `-${anime.name
                                      .replace(/[ /%^&*(),]/g, "-")
                                      .toLocaleLowerCase()}`
                                );
                              }
                              if (v === "producers") {
                                history.push(
                                  "/producer/" +
                                    anime.mal_id +
                                    `-${anime.name
                                      .replace(/[ /%^&*(),]/g, "-")
                                      .toLocaleLowerCase()}`
                                );
                              }
                              if (v === "studios") {
                                history.push(
                                  "/studio/" +
                                    anime.mal_id +
                                    `-${anime.name
                                      .replace(/[ /%^&*(),]/g, "-")
                                      .toLocaleLowerCase()}`
                                );
                              }
                              if (v === "licensors") {
                                history.push(
                                  "/licensor/" +
                                    anime.mal_id +
                                    `-${anime.name
                                      .replace(/[ /%^&*(),]/g, "-")
                                      .toLocaleLowerCase()}`
                                );
                              }
                            }}
                          >
                            {anime.name}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              }
              return (
                <li key={index}>
                  {!/themes/g.test(v) && (
                    <ul className="title-synonym-list">
                      <span className="title-capitalize">
                        {capitalizeString(v)}
                      </span>
                      {animeDetailStream
                        .currentState()
                        .dataInformationAnime[v].map((nameAnime, index) => {
                          return <li key={index}>{nameAnime}</li>;
                        })}
                    </ul>
                  )}

                  {/themes/g.test(v) && (
                    <div
                      style={{
                        border: "none",
                      }}
                    >
                      <div
                        style={{
                          textTransform: "capitalize",
                          fontSize: "2rem",
                        }}
                      >
                        {v}
                      </div>
                      {animeDetailStream
                        .currentState()
                        .dataInformationAnime[v].map((anime, key) => {
                          return <div key={key}>{anime}</div>;
                        })}
                    </div>
                  )}
                </li>
              );
            }
            if (
              animeDetailStream.currentState().dataInformationAnime[v] &&
              animeDetailStream.currentState().dataInformationAnime[v]
                .length !== 0
            ) {
              if (v === "related") {
                const related = animeDetailStream.currentState()
                  .dataInformationAnime[v];
                return Object.keys(related).map((key) => (
                  <li key={key}>
                    <ul className="title-synonym-list">
                      <span className="title-capitalize">
                        {capitalizeString(key)}
                      </span>
                      {related[key].map((anime, index) => {
                        return (
                          <li
                            className={
                              anime.type === "anime" ? "click-able-info" : null
                            }
                            key={index}
                            onClick={() => {
                              if (anime.type === "anime")
                                history.push("/anime/" + anime.mal_id);
                            }}
                          >
                            {anime.name}{" "}
                            {anime.type !== "anime" && (
                              <span>({capitalizeString(anime.type)})</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ));
              }
              if (v === "aired") {
                const aired = animeDetailStream.currentState()
                  .dataInformationAnime[v];
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
                    {aired.prop.from.month &&
                      aired.prop.from.day &&
                      aired.prop.from.year && (
                        <span>
                          {aired.prop.from.month}/{aired.prop.from.day}/
                          {aired.prop.from.year}
                        </span>
                      )}
                    {(!aired.prop.from.month ||
                      !aired.prop.from.day ||
                      !aired.prop.from.year) && <span>??</span>}{" "}
                    -{" "}
                    {aired.prop.to.month &&
                      aired.prop.to.day &&
                      aired.prop.to.year && (
                        <span>
                          {aired.prop.to.month}/{aired.prop.to.day}/
                          {aired.prop.to.year}
                        </span>
                      )}
                    {(!aired.prop.to.month ||
                      !aired.prop.to.day ||
                      !aired.prop.to.year) && <span>??</span>}
                  </li>
                );
              }
            }
            return undefined;
          }
        })}
    </ul>
  );
}

export default ListInformation