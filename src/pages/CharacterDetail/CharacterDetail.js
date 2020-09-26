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
    window.scroll({
      top: 0,
    });
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
          src={
            dataCharacterDetail.image_url ||
            "https://us.123rf.com/450wm/pikepicture/pikepicture1612/pikepicture161200526/68824651-stock-vector-male-default-placeholder-avatar-profile-gray-picture-isolated-on-white-background-for-your-design-ve.jpg?ver=6"
          }
          alt="image_character"
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
        <div
          className="wrapper-text"
          style={{
            boxShadow: "none",
          }}
        >
          <span className="text-capitalize">about</span>
          <pre className="text-about-character">
            {dataCharacterDetail.about.replace(/\\n/g, "")}
          </pre>
        </div>
      )}
      {dataCharacterDetail.animeography &&
        dataCharacterDetail.animeography.length !== 0 && (
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
                    <img src={anime.image_url} alt="image_anime" />
                    <div className="pop-up-hover">
                      <h3>{anime.name}</h3>
                      <div title="role">( {anime.role} )</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      {dataCharacterDetail && dataCharacterDetail.voice_actors && (
        <div className="voice-actor-container">
          <h1 className="text-capitalize">Voice actor</h1>
          <div className="voice-actor-list">
            {dataCharacterDetail.voice_actors.map((actor, index) => {
              return (
                <div
                  className="actor-item"
                  key={index}
                  onClick={() => {
                    history.push("/anime/person/" + actor.mal_id);
                  }}
                >
                  <img
                    src={actor.image_url}
                    alt="person_image"
                    width="100%"
                    height="100%"
                  ></img>
                  <div className="actor-name">
                    <h3 title="name">{actor.name}</h3>
                    <div title="language">( {actor.language} )</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
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
