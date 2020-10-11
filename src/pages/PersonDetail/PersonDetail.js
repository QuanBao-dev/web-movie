import "./PersonDetail.css";

import React, { Suspense, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { fromEvent, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { catchError, debounceTime, filter, pluck, retry } from "rxjs/operators";
import { LazyLoadImage } from "react-lazy-load-image-component";

const AnimeStaffPositions = React.lazy(() =>
  import("../../components/AnimeStaffPositions/AnimeStaffPositions")
);

const AllAnimeRelated = React.lazy(() =>
  import("../../components/AllAnimeRelated/AllAnimeRelated")
);
let updateStaffPosition;
let updateVoiceActingRoles;
let numberDisplay = 10;
const PersonDetail = (props) => {
  const { personId } = props.match.params;
  const history = useHistory();
  const [personDetail, setPersonDetail] = useState({});
  const [pageLoad, setPageLoad] = useState(1);
  useEffect(() => {
    const subscription = fetchDataPerson(personId).subscribe((v) => {
      setPersonDetail(v);
    });
    window.scroll({
      top: 0,
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [personId]);
  useEffect(() => {
    const subscription = updatePageLazyLoad$().subscribe((v) => {
      const currentPage = pageLoad;
      setPageLoad(currentPage + 1);
    });
    if (updateVoiceActingRoles)
      if (
        pageLoad * numberDisplay >
        Object.keys(updateVoiceActingRoles).length
      ) {
        subscription.unsubscribe();
      }
    return () => {
      subscription.unsubscribe();
    };
  }, [pageLoad]);
  const keyPersonInformation = ignoreKeys(Object.keys(personDetail), [
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
  ]);
  // console.log(personDetail);
  if (personDetail.anime_staff_positions) {
    updateStaffPosition = validateDataStaff(updateStaffPosition, personDetail);
  }
  if (personDetail.voice_acting_roles) {
    updateVoiceActingRoles = personDetail.voice_acting_roles.reduce(
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
  if (!personDetail.error)
    return (
      <div className="person-detail-container">
        <div className="person-information-wrapper">
          <img
            className="image-person"
            src={
              personDetail.image_url ||
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
                  {key !== "birthday" && <span>{personDetail[key]}</span>}
                  {key === "birthday" && (
                    <span>
                      {new Date(personDetail[key]).toUTCString().slice(0, 12)}
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>
        {personDetail.about && (
          <div
            className="wrapper-text"
            style={{
              boxShadow: "none",
            }}
          >
            <span className="text-capitalize">about</span>
            <pre className="text-about-person">
              {personDetail.about.replace(/\\n/g, "")}
            </pre>
          </div>
        )}
        {updateStaffPosition && Object.keys(updateStaffPosition).length !== 0 && (
          <div>
            <h1 className="text-capitalize">Anime Staff Positions</h1>
            <Suspense fallback={<div>Loading...</div>}>
              <AnimeStaffPositions
                history={history}
                updateStaffPosition={updateStaffPosition}
              />
            </Suspense>
          </div>
        )}
        {updateVoiceActingRoles &&
          Object.keys(updateVoiceActingRoles).length !== 0 && (
            <div>
              <h1 className="text-capitalize">Voice Acting Roles</h1>
              <div className="list-anime-voice-acting">
                {Object.keys(updateVoiceActingRoles)
                  .slice(0, numberDisplay * pageLoad)
                  .map((key, index) => (
                    <div key={index} className="person-voice-item">
                      <div
                        className="character-item-voice"
                        onClick={() => {
                          history.push(
                            "/anime/character/" +
                              updateVoiceActingRoles[key].mal_id
                          );
                        }}
                      >
                        <LazyLoadImage
                          src={updateVoiceActingRoles[key].image_url}
                          alt="image_character"
                        />
                        <div className="pop-up-hover-character">
                          <h3>{updateVoiceActingRoles[key].name}</h3>
                        </div>
                      </div>
                      <Suspense fallback={<div>Loading...</div>}>
                        <AllAnimeRelated
                          animeList={updateVoiceActingRoles[key].animeList}
                          history={history}
                        />
                      </Suspense>
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

function validateDataStaff(updateStaffPosition, personDetail) {
  updateStaffPosition = personDetail.anime_staff_positions.reduce(
    (ans, dataActor) => {
      if (!ans[dataActor.anime.mal_id]) {
        ans[dataActor.anime.mal_id] = {};
      }
      ans[dataActor.anime.mal_id] = {
        ...ans[dataActor.anime.mal_id],
        ...dataActor.anime,
      };
      if (!ans[dataActor.anime.mal_id].positions) {
        ans[dataActor.anime.mal_id].positions = [];
      }
      ans[dataActor.anime.mal_id].positions = [
        ...ans[dataActor.anime.mal_id].positions,
        dataActor.position,
      ];
      return ans;
    },
    {}
  );
  return updateStaffPosition;
}

function fetchDataPerson(personId) {
  return ajax("https://api.jikan.moe/v3/person/" + personId).pipe(
    retry(5),
    pluck("response"),
    catchError(() => {
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
  return fromEvent(window, "scroll").pipe(
    debounceTime(500),
    filter(() => document.body.scrollHeight - (window.scrollY + 2000) < 0)
  );
}

export default PersonDetail;
