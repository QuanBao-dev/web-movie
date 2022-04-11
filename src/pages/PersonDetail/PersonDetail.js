import "./PersonDetail.css";

import loadable from "@loadable/component";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useEffect, useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { BehaviorSubject, from, fromEvent, of, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  concatAll,
  filter,
  map,
  mergeMapTo,
  pluck,
  retry,
  tap,
  timeout,
} from "rxjs/operators";

const AnimeStaffPositions = loadable(
  () => import("../../components/AnimeStaffPositions/AnimeStaffPositions"),
  {
    fallback: <CircularProgress color="primary" size="7rem" />,
  }
);

const AllAnimeRelated = loadable(
  () => import("../../components/AllAnimeRelated/AllAnimeRelated"),
  {
    fallback: <CircularProgress color="primary" size="7rem" />,
  }
);
let numberDisplay = 1;
const initialState = {
  pageSplit: 1,
  dataPersonDetail: {},
  malId: null,
  lazy: true,
};
let state = initialState;
const behaviorSubject = new BehaviorSubject();
const personDetailStore = {
  initialState: initialState,
  subscribe: (setState) => behaviorSubject.subscribe(setState),
  init: () => {
    behaviorSubject.next(state);
  },
  updateData: (object = initialState) => {
    state = {
      ...state,
      ...object,
    };
    behaviorSubject.next(state);
  },
  updatePageSplit: (page) => {
    state = {
      ...state,
      pageSplit: page,
    };
    behaviorSubject.next(state);
  },
  updateDataPersonDetail: (data) => {
    state = {
      ...state,
      dataPersonDetail: data,
    };
    behaviorSubject.next(state);
  },
  currentState: () => {
    let ans;
    behaviorSubject.subscribe((v) => (ans = v));
    return ans || initialState;
  },
  resetData: () => {
    state = {
      ...state,
      pageSplit: 1,
      malId: null,
      dataPersonDetail: {},
    };
    behaviorSubject.next(state);
  },
};
const PersonDetail = (props) => {
  let { personId } = props.match.params;
  personId = parseInt(personId);
  const updateVoiceActingRoles = useRef();
  const history = useHistory();
  const [personDetailState, setPersonDetailState] = useState(
    personDetailStore.currentState() || personDetailStore.initialState
  );
  const [isDoneLoadingVoices, setIsDoneLoadingVoices] = useState(false);
  useEffect(() => {
    const subscription = personDetailStore.subscribe(setPersonDetailState);
    window.scroll({ top: 0 });
    return () => {
      personDetailStore.updateData({ lazy: false });
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    let subscription;
    if (personDetailState.malId !== personId) {
      personDetailStore.updateData({
        lazy: true,
        pageSplit: 1,
        malId: null,
        dataPersonDetail: {},
      });

      updateVoiceActingRoles.current = null;
      subscription = fetchDataPerson$(
        personId,
        setIsDoneLoadingVoices
      ).subscribe((v) => {
        if (v.error) return;
        personDetailStore.updateData({
          dataPersonDetail: {
            ...personDetailStore.currentState().dataPersonDetail,
            ...v,
          },
        });
        if (v.typeResponse === "voices") {
          // console.log("done");
          personDetailStore.updateData({ malId: personId });
        }
      });
    } else {
      setIsDoneLoadingVoices(true);
    }
    return () => {
      subscription && subscription.unsubscribe();
    };
  }, [personId, personDetailState.malId]);
  useEffect(() => {
    const subscription = updatePageLazyLoad$().subscribe((v) => {
      personDetailStore.updatePageSplit(
        personDetailStore.currentState().pageSplit + 1
      );
    });
    if (updateVoiceActingRoles.current)
      if (
        personDetailState.pageSplit * numberDisplay >
        Object.keys(updateVoiceActingRoles.current).length
      ) {
        subscription.unsubscribe();
      }
    return () => {
      subscription.unsubscribe();
    };
  }, [personDetailState.pageSplit]);
  const keyPersonInformation = ignoreKeys(
    Object.keys(personDetailState.dataPersonDetail),
    [
      "typeResponse",
      "request_hash",
      "request_cached",
      "request_cache_expiry",
      "mal_id",
      "published_manga",
      "voice_acting_roles",
      "anime_staff_positions",
      "manga_staff_positions",
      "alternate_names",
      "about",
      "image_url",
      "url",
      "website_url",
      "images",
    ]
  );

  if (personDetailState.dataPersonDetail.voice_acting_roles) {
    updateVoiceActingRoles.current =
      personDetailState.dataPersonDetail.voice_acting_roles.reduce(
        (ans, dataVoiceActor) => {
          if (!ans[dataVoiceActor.character.mal_id])
            ans[dataVoiceActor.character.mal_id] = {};
          ans[dataVoiceActor.character.mal_id] = {
            ...ans[dataVoiceActor.character.mal_id],
            ...dataVoiceActor.character,
          };
          !ans[dataVoiceActor.character.mal_id].animeList &&
            (ans[dataVoiceActor.character.mal_id].animeList = []);
          ans[dataVoiceActor.character.mal_id].animeList = [
            ...ans[dataVoiceActor.character.mal_id].animeList,
            { ...dataVoiceActor.anime, role: dataVoiceActor.role },
          ];
          return ans;
        },
        {}
      );
  }
  if (!personDetailState.dataPersonDetail.error)
    return (
      <div className="person-detail-container">
        <div className="person-information-wrapper">
          <img
            className="image-person"
            src={
              personDetailState.dataPersonDetail.image_url ||
              "https://us.123rf.com/450wm/pikepicture/pikepicture1612/pikepicture161200526/68824651-stock-vector-male-default-placeholder-avatar-profile-gray-picture-isolated-on-white-background-for-your-design-ve.jpg?ver=6"
            }
            alt="image_person"
          ></img>
          {keyPersonInformation.length > 0 && (
            <div className="person-information">
              {keyPersonInformation &&
                keyPersonInformation.map((key, index) => (
                  <div className="wrapper-text" key={index}>
                    <span className="text-capitalize">
                      {key.replace("_", " ")}
                    </span>
                    {key !== "birthday" && (
                      <span>
                        {personDetailState.dataPersonDetail[key] || "Unknown"}
                      </span>
                    )}
                    {key === "birthday" && (
                      <span>
                        {new Date(personDetailState.dataPersonDetail[key])
                          .toUTCString()
                          .slice(0, 12)}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
        {personDetailState.dataPersonDetail.about && (
          <div
            className="wrapper-text"
            style={{
              boxShadow: "none",
            }}
          >
            <span className="text-capitalize">about</span>
            <pre className="text-about-person">
              {personDetailState.dataPersonDetail.about.replace(/\\n/g, "")}
            </pre>
          </div>
        )}
        {personDetailState.dataPersonDetail.anime_staff_positions &&
          personDetailState.dataPersonDetail.anime_staff_positions.length >
            0 && (
            <div>
              <h1 className="text-capitalize">Anime Staff Positions</h1>
              <AnimeStaffPositions
                history={history}
                lazy={personDetailState.lazy}
                updateStaffPosition={
                  personDetailState.dataPersonDetail.anime_staff_positions
                }
              />
            </div>
          )}
        {personDetailState.dataPersonDetail.manga_staff_positions &&
          personDetailState.dataPersonDetail.manga_staff_positions.length >
            0 && (
            <div>
              <h1 className="text-capitalize">Manga Staff Positions</h1>
              <AnimeStaffPositions
                history={history}
                lazy={personDetailState.lazy}
                updateStaffPosition={
                  personDetailState.dataPersonDetail.manga_staff_positions
                }
                isManga={true}
              />
            </div>
          )}
        {updateVoiceActingRoles.current &&
          Object.keys(updateVoiceActingRoles.current).length !== 0 && (
            <div>
              <h1 className="text-capitalize">Voice Acting Roles</h1>
              <div className="list-anime-voice-acting">
                {Object.keys(updateVoiceActingRoles.current)
                  .slice(
                    0,
                    numberDisplay * (personDetailState.pageSplit - 1) + 1
                  )
                  .map((key, index) => (
                    <div key={index} className="person-voice-item">
                      <Link
                        to={`/character/${
                          updateVoiceActingRoles.current[key].mal_id
                        }-${updateVoiceActingRoles.current[key].name
                          .replace(/[ /%^&*():.$,]/g, "-")
                          .toLocaleLowerCase()}`}
                        className="character-item-voice"
                      >
                        <img
                          className="person__image-character"
                          src={
                            updateVoiceActingRoles.current[key].images.jpg
                              .large_image_url ||
                            updateVoiceActingRoles.current[key].images.jpg
                              .image_url
                          }
                          alt="image_character"
                        />
                        <div className="pop-up-hover-character">
                          <h3>{updateVoiceActingRoles.current[key].name}</h3>
                        </div>
                      </Link>
                      <AllAnimeRelated
                        animeList={updateVoiceActingRoles.current[
                          key
                        ].animeList.map(
                          ({ role, title, url, images, mal_id }) => ({
                            role,
                            anime: {
                              title,
                              url,
                              images,
                              mal_id,
                            },
                          })
                        )}
                        history={history}
                        lazy={personDetailState.lazy}
                      />
                    </div>
                  ))}
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
  else
    return (
      <div>
        <h1>No information about this actor</h1>
      </div>
    );
};

function fetchDataPerson$(personId, setIsDoneLoading) {
  return from([
    ajax("https://api.jikan.moe/v4/people/" + personId).pipe(
      pluck("response", "data"),
      map((data) => ({ data, typeResponse: "info" })),
      tap(({ status }) => {
        if (status === 500) {
          throw Error("Something went wrong");
        }
      }),
      timeout(3000),
      retry(10)
    ),
    ajax(`https://api.jikan.moe/v4/people/${personId}/anime`).pipe(
      pluck("response", "data"),
      map((data) => ({ data, typeResponse: "anime" })),
      timeout(3000),
      tap(({ status }) => {
        if (status === 500) {
          throw Error("Something went wrong");
        }
      }),
      retry(10)
    ),
    ajax(`https://api.jikan.moe/v4/people/${personId}/manga`).pipe(
      pluck("response", "data"),
      map((data) => ({ data, typeResponse: "manga" })),
      timeout(3000),
      tap(({ status }) => {
        if (status === 500) {
          throw Error("Something went wrong");
        }
      }),
      retry(10)
    ),
    ajax(`https://api.jikan.moe/v4/people/${personId}/voices`).pipe(
      pluck("response", "data"),
      map((data) => ({ data, typeResponse: "voices" })),
      timeout(3000),
      tap(({ status }) => {
        if (status === 500) {
          throw Error("Something went wrong");
        }
      }),
      retry(10)
    ),
  ]).pipe(
    concatAll(),
    map((response) => {
      if (!response.data) return;
      switch (response.typeResponse) {
        case "info":
          return {
            ...response.data,
            image_url: response.data.images.webp
              ? response.data.images.webp.image_url
              : response.data.images.jpg.image_url,
          };
        case "anime":
          return {
            anime_staff_positions: response.data,
          };
        case "manga":
          return { manga_staff_positions: response.data };
        default:
          setIsDoneLoading(true);
          return {
            voice_acting_roles: response.data,
            typeResponse: "voices",
          };
      }
    }),
    catchError((error) => {
      console.error(error);
      return of({ error: "Something went wrong" });
    })
  );
}

function ignoreKeys(keys, ignoreList) {
  return keys.reduce((ans, key) => {
    if (!ignoreList.includes(key)) {
      ans.push(key);
    }
    return ans;
  }, []);
}

function updatePageLazyLoad$() {
  return timer(0).pipe(
    mergeMapTo(
      fromEvent(window, "scroll").pipe(
        filter(() => document.body.scrollHeight - (window.scrollY + 900) < 0)
      )
    )
  );
}

export default PersonDetail;
