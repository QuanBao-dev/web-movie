import "./CharacterDetail.css";
import "react-lazy-load-image-component/src/effects/opacity.css";

import loadable from "@loadable/component";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useEffect, useState, useRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { from, iif, of, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  concatAll,
  delay,
  map,
  pluck,
  retry,
  tap,
  timeout,
} from "rxjs/operators";

import { characterStream } from "../../epics/character";
import cachesStore from "../../store/caches";

const AllAnimeRelated = loadable(() =>
  import("../../components/AllAnimeRelated/AllAnimeRelated")
);

const CharacterDetail = (props) => {
  const characterId = parseInt(props.match.params.characterId);
  const [dataCharacterDetail, setDataCharacterDetail] = useState({});
  const dataCharacterDetailRef = useRef({});
  useEffect(() => {
    window.scroll({
      top: 0,
    });
    return () => {
      characterStream.updateData({ role: null });
    };
  }, []);

  const [isDoneLoadingVoices, setIsDoneLoadingVoices] = useState(false);
  useEffect(() => {
    const subscription = fetchData$(
      characterId,
      setIsDoneLoadingVoices
    ).subscribe((v) => {
      if (v.error) return;
      setDataCharacterDetail({ ...dataCharacterDetailRef.current, ...v });
      dataCharacterDetailRef.current = {
        ...dataCharacterDetailRef.current,
        ...v,
      };
    });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {dataCharacterDetail.name && (
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
            {!!dataCharacterDetail.favorites && (
              <div className="wrapper-text">
                <span className="text-capitalize">favorites</span>
                <span>{dataCharacterDetail.favorites}</span>
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
        )}
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
            <h1 className="text-capitalize">Related Anime</h1>
            <AllAnimeRelated
              animeList={dataCharacterDetail.animeography}
              lazy={true}
            />
          </div>
        )}
      {dataCharacterDetail.mangagraphy &&
        dataCharacterDetail.mangagraphy.length !== 0 && (
          <div className="character-appear-container">
            <h1 className="text-capitalize">Related Manga</h1>
            <AllAnimeRelated
              animeList={dataCharacterDetail.mangagraphy}
              lazy={true}
            />
          </div>
        )}

      {dataCharacterDetail.voice_actors &&
        dataCharacterDetail.voice_actors.length > 0 && (
          <div className="voice-actor-container">
            <h1 className="text-capitalize">
              Voice actor
              {dataCharacterDetail.voice_actors.length > 1 ? "s" : ""}
            </h1>
            <div className="voice-actor-list">
              {dataCharacterDetail.voice_actors.map((actor, index) => {
                return (
                  <Link
                    to={
                      "/person/" +
                      actor.person.mal_id +
                      "-" +
                      actor.person.name
                        .replace(/[ /%^&*():.$,]/g, "-")
                        .toLocaleLowerCase()
                    }
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
                      <h3 title={actor.person.name.replace(",", "")}>
                        {actor.person.name.replace(",", "")}
                      </h3>
                      <div title={actor.language}>( {actor.language} )</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      {!isDoneLoadingVoices && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress color="secondary" size="4rem" />
        </div>
      )}
    </div>
  );
};

function fetchCharacterDetailData$(characterId) {
  return iif(
    () =>
      cachesStore.currentState().dataCharacterDetail &&
      cachesStore.currentState().dataCharacterDetail[characterId] &&
      cachesStore.currentState().dataCharacterDetail[characterId]["info"],
    timer(0).pipe(
      map(
        () =>
          cachesStore.currentState().dataCharacterDetail[characterId]["info"].data
      )
    ),
    ajax(`https://api.jikan.moe/v4/characters/${characterId}`).pipe(
      timeout(3000),
      retry(10),
      pluck("response", "data"),
      tap(({ status }) => {
        if (status === 500) {
          throw Error("Something went wrong");
        }
      })
    )
  );
}

function fetchVoiceActorByCharacterId$(characterId) {
  return iif(
    () =>
      cachesStore.currentState().dataCharacterDetail &&
      cachesStore.currentState().dataCharacterDetail[characterId] &&
      cachesStore.currentState().dataCharacterDetail[characterId][
        "voice actor"
      ],
    timer(0).pipe(
      map(
        () =>
          cachesStore.currentState().dataCharacterDetail[characterId][
            "voice actor"
          ].data
      )
    ),
    ajax(`https://api.jikan.moe/v4/characters/${characterId}/voices`).pipe(
      timeout(3000),
      delay(1500),
      tap(({ status }) => {
        if (status === 500) {
          throw Error("Something went wrong");
        }
      }),
      pluck("response", "data"),
      retry(10)
    )
  );
}
function fetchAnimeByCharacterId$(characterId) {
  return iif(
    () =>
      cachesStore.currentState().dataCharacterDetail &&
      cachesStore.currentState().dataCharacterDetail[characterId] &&
      cachesStore.currentState().dataCharacterDetail[characterId]["anime"],
    timer(0).pipe(
      map(
        () =>
          cachesStore.currentState().dataCharacterDetail[characterId]["anime"].data
      )
    ),
    ajax(`https://api.jikan.moe/v4/characters/${characterId}/anime`).pipe(
      timeout(3000),
      delay(1500),
      retry(10),
      pluck("response", "data"),
      tap(({ status }) => {
        if (status === 500) {
          throw Error("Something went wrong");
        }
      })
    )
  );
}
function fetchMangaByCharacterId$(characterId) {
  return iif(
    () =>
      cachesStore.currentState().dataCharacterDetail &&
      cachesStore.currentState().dataCharacterDetail[characterId] &&
      cachesStore.currentState().dataCharacterDetail[characterId]["manga"],
    timer(0).pipe(
      map(
        () =>
          cachesStore.currentState().dataCharacterDetail[characterId]["manga"].data
      )
    ),
    ajax(`https://api.jikan.moe/v4/characters/${characterId}/manga`).pipe(
      timeout(3000),
      delay(1500),
      retry(10),
      pluck("response", "data"),
      tap(({ status }) => {
        if (status) {
          throw Error("Something went wrong");
        }
      })
    )
  );
}

function fetchData$(characterId, setIsDoneLoadingVoices) {
  return from([
    fetchCharacterDetailData$(characterId).pipe(
      map((data) => ({ data, typeResponse: "info" })),
      catchError(() => of({})),
    ),
    fetchAnimeByCharacterId$(characterId).pipe(
      map((data) => ({ data, typeResponse: "anime" })),
      catchError(() => of([])),
    ),
    fetchMangaByCharacterId$(characterId).pipe(
      map((data) => ({ data, typeResponse: "manga" })),
      catchError(() => of([])),
    ),
    fetchVoiceActorByCharacterId$(characterId).pipe(
      map((data) => ({ data, typeResponse: "voice actor" })),
      catchError(() => of([]))
    ),
  ]).pipe(
    concatAll(),
    map((response) => {
      // [dataCharacter, dataVoiceActor, dataAnime, dataManga]
      cachesStore.updateData({
        dataCharacterDetail: {
          ...cachesStore.currentState().dataCharacterDetail,
          [characterId]: {
            ...(cachesStore.currentState().dataCharacterDetail || {})[
              characterId
            ],
            [response.typeResponse]: {
              ...response,
            },
          },
        },
      });
      switch (response.typeResponse) {
        case "info":
          return {
            ...response.data,
          };
        case "anime":
          return {
            animeography: [...response.data],
          };
        case "manga":
          return {
            mangagraphy: [
              ...response.data.map(({ manga, role }) => ({
                anime: manga,
                role,
                type: "manga",
              })),
            ],
            typeResponse: "manga",
          };
        default:
          setIsDoneLoadingVoices(true);
          return {
            voice_actors: response.data,
          };
      }
    }),
    catchError((error) => {
      console.error(error);
      return of({ error: "Something went wrong" });
    })
  );
}

export default CharacterDetail;
