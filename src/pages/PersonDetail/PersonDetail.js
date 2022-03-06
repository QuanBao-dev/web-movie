import "./PersonDetail.css";

import loadable from "@loadable/component";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { BehaviorSubject, from, fromEvent, of, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  filter,
  mergeMapTo,
  pluck,
  retry,
  timeout,
  map,
  combineAll,
} from "rxjs/operators";

import navBarStore from "../../store/navbar";

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
let updateVoiceActingRoles;
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
  updateMalId: (malId) => {
    state = {
      ...state,
      malId,
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
  const { personId } = props.match.params;
  const history = useHistory();
  // const [personDetail, setPersonDetail] = useState({});
  const [personDetailState, setPersonDetailState] = useState(
    personDetailStore.currentState() || personDetailStore.initialState
  );
  useEffect(() => {
    const subscription = personDetailStore.subscribe(setPersonDetailState);
    personDetailStore.init();
    window.scroll({ top: 0 });
    return () => {
      personDetailStore.updateData({ lazy: false });
      subscription.unsubscribe();
      navBarStore.updateIsShowBlockPopUp(false);
    };
  }, []);
  useEffect(() => {
    let subscription;
    if (personDetailState.malId !== personId) {
      personDetailStore.updateData({ lazy: true });
      personDetailStore.resetData();
      subscription = fetchDataPerson$(personId).subscribe((v) => {
        navBarStore.updateIsShowBlockPopUp(false);
        personDetailStore.updateDataPersonDetail(v);
        personDetailStore.updateMalId(personId);
        window.scroll({
          top: 0,
        });
      });
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
    if (updateVoiceActingRoles)
      if (
        personDetailState.pageSplit * numberDisplay >
        Object.keys(updateVoiceActingRoles).length
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
      "request_hash",
      "request_cached",
      "request_cache_expiry",
      "mal_id",
      "published_manga",
      "voice_acting_roles",
      "anime_staff_positions",
      "alternate_names",
      "about",
      "image_url",
      "url",
      "website_url",
      "images",
    ]
  );
  // if (personDetailState.dataPersonDetail.anime_staff_positions) {
  //   updateStaffPosition = validateDataStaff(
  //     updateStaffPosition,
  //     personDetailState.dataPersonDetail
  //   );
  // }
  if (personDetailState.dataPersonDetail.voice_acting_roles) {
    updateVoiceActingRoles =
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
          <div className="person-information">
            {keyPersonInformation &&
              keyPersonInformation.map((key, index) => (
                <div className="wrapper-text" key={index}>
                  <span className="text-capitalize">
                    {key.replace("_", " ")}
                  </span>
                  {key !== "birthday" && (
                    <span>{personDetailState.dataPersonDetail[key]}</span>
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
        {updateVoiceActingRoles &&
          Object.keys(updateVoiceActingRoles).length !== 0 && (
            <div>
              <h1 className="text-capitalize">Voice Acting Roles</h1>
              <div className="list-anime-voice-acting">
                {Object.keys(updateVoiceActingRoles)
                  .slice(
                    0,
                    numberDisplay * (personDetailState.pageSplit - 1) + 1
                  )
                  .map((key, index) => (
                    <div key={index} className="person-voice-item">
                      <Link
                        to={
                          "/anime/character/" +
                          updateVoiceActingRoles[key].mal_id
                        }
                        className="character-item-voice"
                      >
                        <img
                          className="person__image-character"
                          src={
                            updateVoiceActingRoles[key].images.jpg
                              .large_image_url ||
                            updateVoiceActingRoles[key].images.jpg.image_url
                          }
                          alt="image_character"
                        />
                        <div className="pop-up-hover-character">
                          <h3>{updateVoiceActingRoles[key].name}</h3>
                        </div>
                      </Link>
                      <AllAnimeRelated
                        animeList={updateVoiceActingRoles[key].animeList}
                        history={history}
                        lazy={personDetailState.lazy}
                      />
                    </div>
                  ))}
              </div>
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

function fetchDataPerson$(personId) {
  navBarStore.updateIsShowBlockPopUp(true);
  return from([
    ajax("https://api.jikan.moe/v4/people/" + personId).pipe(
      pluck("response", "data"),
      timeout(3000),
      retry(50)
    ),
    ajax(`https://api.jikan.moe/v4/people/${personId}/anime`).pipe(
      pluck("response", "data"),
      timeout(3000),
      retry(50)
    ),
    ajax(`https://api.jikan.moe/v4/people/${personId}/voices`).pipe(
      pluck("response", "data"),
      timeout(3000),
      retry(50)
    ),
  ]).pipe(
    combineAll(),
    map(([dataPerson, dataStaffPositions, dataPersonVoiceActingRoles]) => {
      return {
        ...dataPerson,
        image_url: dataPerson.images.jpg.image_url,
        voice_acting_roles: dataPersonVoiceActingRoles,
        anime_staff_positions: dataStaffPositions,
      };
    }),
    catchError((error) => {
      console.log(error);
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
