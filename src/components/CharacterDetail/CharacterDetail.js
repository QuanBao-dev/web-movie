import "./CharacterDetail.css";

import React, { useEffect, useState } from "react";
import { of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { catchError, pluck, retry } from "rxjs/operators";
import { useHistory } from "react-router-dom";
import { characterStream } from "../../epics/character";

const CharacterDetail = (props) => {
  const { characterId } = props.match.params;
  const history = useHistory();
  const [dataCharacterDetail, setDataCharacterDetail] = useState({});
  useEffect(() => {
    const subscription = fetchCharacterDetailData$(characterId).subscribe(
      (data) => {
        setDataCharacterDetail(data);
      }
    );
    return () => {
      subscription.unsubscribe();
    };
  }, [characterId]);
  // console.log(dataCharacterDetail);
  return (
    <div className="character-detail-container">
      <div className="character-information-wrapper">
        <img
          className="image-character"
          src={dataCharacterDetail.image_url}
          alt="NOT FOUND"
        ></img>
        <div className="character-information">
          {dataCharacterDetail.name && (
            <div className="wrapper-text">
              <span className="text-capitalize">name</span>
              <span>{dataCharacterDetail.name}</span>
            </div>
          )}
          {characterStream.currentState() &&
            characterStream.currentState().role && (
              <div className="wrapper-text">
                <span className="text-capitalize">role</span>
                <span>{characterStream.currentState().role}</span>
              </div>
            )}
          {dataCharacterDetail.name_kanji && (
            <div className="wrapper-text">
              <span className="text-capitalize">name kanji</span>
              <span>{dataCharacterDetail.name_kanji}</span>
            </div>
          )}
          {dataCharacterDetail.nicknames &&
            dataCharacterDetail.nicknames.length > 0 && (
              <div className="wrapper-text">
                <span className="text-capitalize">nicknames</span>
                <span>{dataCharacterDetail.nicknames.join(", ")}</span>
              </div>
            )}
        </div>
      </div>
      {dataCharacterDetail.about && (
        <div className="wrapper-text" style={{
          boxShadow:"none"
        }}>
          <span className="text-capitalize">about</span>
          <pre className="text-about-character">
            {dataCharacterDetail.about.replace(/\\n/g, "")}
          </pre>
        </div>
      )}
      <div className="character-appear-container">
        <h1 className="text-capitalize">Character appears in...</h1>
        <div className="all-anime-related">
          {dataCharacterDetail.animeography &&
            dataCharacterDetail.animeography.map((anime, index) => (
              <div
                className={anime.role === "Main" ? "anime-main-role" : ""}
                key={index}
                onClick={() => history.push("/anime/" + anime.mal_id)}
              >
                <img src={anime.image_url} alt="NOT FOUND" />
                <div className="pop-up-hover">
                  <h3>{anime.name}</h3>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

function fetchCharacterDetailData$(characterId) {
  return ajax(`https://api.jikan.moe/v3/character/${characterId}`).pipe(
    retry(20),
    pluck("response"),
    catchError(() => of({}))
  );
}

export default CharacterDetail;
