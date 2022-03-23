import "./CharacterDetail.css";
import "react-lazy-load-image-component/src/effects/opacity.css";

import loadable from "@loadable/component";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { from, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  combineAll,
  pluck,
  retry,
  timeout,
  map,
} from "rxjs/operators";

import { characterStream } from "../../epics/character";
import { LazyLoadImage } from "react-lazy-load-image-component";
import navBarStore from "../../store/navbar";

const AllAnimeRelated = loadable(() =>
  import("../../components/AllAnimeRelated/AllAnimeRelated")
);

const CharacterDetail = (props) => {
  const characterId = parseInt(props.match.params.characterId);
  const [dataCharacterDetail, setDataCharacterDetail] = useState({});
  useEffect(() => {
    window.scroll({
      top: 0,
    });
    return () => {
      navBarStore.updateIsShowBlockPopUp(false);
    };
  }, []);
  useEffect(() => {
    const subscription = fetchData$(characterId).subscribe((data) => {
      window.scroll({
        top: 0,
      });
      navBarStore.updateIsShowBlockPopUp(false);
      setDataCharacterDetail(data);
    });
    return () => {
      subscription.unsubscribe();
      characterStream.updateData({ role: null });
    };
  }, [characterId]);
  return (
    <div className="character-detail-container">
      <div className="character-information-wrapper">
        <img
          className="image-character"
          src={
            dataCharacterDetail.images
              ? dataCharacterDetail.images.webp.image_url
              : "https://us.123rf.com/450wm/pikepicture/pikepicture1612/pikepicture161200526/68824651-stock-vector-male-default-placeholder-avatar-profile-gray-picture-isolated-on-white-background-for-your-design-ve.jpg?ver=6"
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
            <AllAnimeRelated
              animeList={dataCharacterDetail.animeography}
              lazy={true}
            />
          </div>
        )}
      {dataCharacterDetail.voice_actors &&
        dataCharacterDetail.voice_actors.length > 0 && (
          <div className="voice-actor-container">
            <h1 className="text-capitalize">Voice actor</h1>
            <div className="voice-actor-list">
              {dataCharacterDetail.voice_actors.map((actor, index) => {
                return (
                  <Link
                    to={"/anime/person/" + actor.person.mal_id}
                    className="actor-item"
                    key={index}
                  >
                    <LazyLoadImage
                      src={actor.person.images.jpg.image_url}
                      alt="person_image"
                      width="100%"
                      effect="opacity"
                      height="100%"
                    />
                    <div className="actor-name">
                      <h3 title="name">{actor.person.name}</h3>
                      <div title="language">( {actor.language} )</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
    </div>
  );
};

function fetchCharacterDetailData$(characterId) {
  navBarStore.updateIsShowBlockPopUp(true);
  return ajax(`https://api.jikan.moe/v4/characters/${characterId}`).pipe(
    timeout(3000),
    retry(20),
    pluck("response", "data"),
    catchError(() => of({}))
  );
}

function fetchVoiceActorByCharacterId$(characterId) {
  return ajax(`https://api.jikan.moe/v4/characters/${characterId}/voices`).pipe(
    timeout(3000),
    retry(20),
    pluck("response", "data"),
    catchError(() => of([]))
  );
}
function fetchAnimeByCharacterId$(characterId) {
  return ajax(`https://api.jikan.moe/v4/characters/${characterId}/anime`).pipe(
    timeout(3000),
    retry(20),
    pluck("response", "data"),
    catchError(() => of([]))
  );
}

function fetchData$(characterId) {
  return from([
    fetchCharacterDetailData$(characterId),
    fetchVoiceActorByCharacterId$(characterId),
    fetchAnimeByCharacterId$(characterId),
  ]).pipe(
    combineAll(),
    map(([dataCharacter, dataVoiceActor, dataAnime]) => {
      return {
        ...dataCharacter,
        animeography: dataAnime,
        voice_actors: dataVoiceActor,
      };
    })
  );
}

export default CharacterDetail;
