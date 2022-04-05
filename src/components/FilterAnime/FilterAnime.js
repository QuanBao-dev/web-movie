import "./FilterAnime.css";

import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { fromEvent, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import { filter, pluck, switchMapTo, tap } from "rxjs/operators";

import storageAnimeStore from "../../store/storageAnime";
import CustomSelect from "../CustomSelect/CustomSelect";
import CustomSelect2 from "../CustomSelect2/CustomSelect2";

const FilterAnime = () => {
  const buttonFilterRef = useRef();
  const history = useHistory();

  const genresExcludeValueRef = useRef([]);
  const producerValueRef = useRef([]);
  const genresValueRef = useRef([]);
  const themesValueRef = useRef([]);

  const typeValueRef = useRef("");
  const statusValueRef = useRef("");
  const sortValueRef = useRef("");
  const ratingValueRef = useRef("");
  const orderByValueRef = useRef("");

  const letterRef = useRef("");
  const textRef = useRef("");
  const minScoreRef = useRef("");
  const maxScoreRef = useRef("");
  const searchByRef = useRef("");

  const sfwRef = useRef(false);
  const [searchByState, setSearchByState] = useState("anime");
  const [triggerReset, setTriggerReset] = useState(false);
  const [orderByState, setOrderByState] = useState("");
  const [maxScoreState, setMaxScoreState] = useState(10);
  const [minScoreState, setMinScoreState] = useState(0);

  const [storageAnimeState, setStorageAnimeState] = useState(
    storageAnimeStore.currentState()
  );
  useEffect(() => {
    typeValueRef.current = "";
    statusValueRef.current = "";
    sortValueRef.current = "asc";
    ratingValueRef.current = "";
    orderByValueRef.current = "";
    letterRef.current.value = "";
    textRef.current.value = "";
    minScoreRef.current = "";
    maxScoreRef.current = "";
    sfwRef.current && (sfwRef.current.checked = false);
    producerValueRef.current = [];
    genresExcludeValueRef.current = [];
    genresValueRef.current = [];
    setOrderByState(false);
    setTriggerReset(!triggerReset);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[searchByState])
  useEffect(() => {
    if (minScoreState === "") setMinScoreState(0);
    if (maxScoreState === "") setMaxScoreState(10);
  }, [minScoreState, maxScoreState]);
  useEffect(() => {
    const subscription = timer(0)
      .pipe(
        tap(() => {
          ratingValueRef.current = storageAnimeState.rating;
          statusValueRef.current = storageAnimeState.status;
          typeValueRef.current = storageAnimeState.type;
          sortValueRef.current = storageAnimeState.sort;
          searchByRef.current = storageAnimeState.searchBy;
          setSearchByState(searchByRef.current);
          orderByValueRef.current = storageAnimeState.orderBy;
          sfwRef.current &&
            (sfwRef.current.checked = storageAnimeState.sfw === "sfw");
          minScoreRef.current = storageAnimeState.min_score;
          maxScoreRef.current = storageAnimeState.max_score;
          setMinScoreState(storageAnimeState.min_score);
          setMaxScoreState(storageAnimeState.max_score);
          setOrderByState(storageAnimeState.orderBy);
          letterRef.current &&
            (letterRef.current.value = storageAnimeState.letter);
          textRef.current && (textRef.current.value = storageAnimeState.q);
          genresValueRef.current =
            storageAnimeState.genresDataOptionsList.filter(({ mal_id }) =>
              storageAnimeState.genres.split(",").includes(mal_id.toString())
            );
          themesValueRef.current =
            storageAnimeState.themesDataOptionsList.filter(({ mal_id }) =>
              storageAnimeState.themes.split(",").includes(mal_id.toString())
            );
          genresExcludeValueRef.current =
            storageAnimeState.genresDataOptionsList.filter(({ mal_id }) =>
              storageAnimeState.genres_exclude
                .split(",")
                .includes(mal_id.toString())
            );
          if (!storageAnimeState.producers) setTriggerReset(!triggerReset);
        }),
        filter(() => storageAnimeState.producers),
        switchMapTo(
          ajax("/api/producers/" + storageAnimeState.producers).pipe(
            pluck("response", "message")
          )
        )
      )
      .subscribe((data) => {
        if (!data) return;
        producerValueRef.current = data;
        setTriggerReset(!triggerReset);
      });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    storageAnimeState.status,
    storageAnimeState.dataAnime,
    storageAnimeState.rating,
    storageAnimeState.orderBy,
    storageAnimeState.sfw,
    storageAnimeState.max_score,
    storageAnimeState.min_score,
    storageAnimeState.score,
    storageAnimeState.producers,
    storageAnimeState.genres,
    storageAnimeState.genres_exclude,
    storageAnimeState.type,
    storageAnimeState.sort,
    storageAnimeState.searchBy,
    storageAnimeState.q,
  ]);

  useEffect(() => {
    const subscriptionInit = storageAnimeStore.subscribe(setStorageAnimeState);
    const subscription = fromEvent(buttonFilterRef.current, "click").subscribe(
      () => {
        const producerMalIdListString = producerValueRef.current
          ? producerValueRef.current.map(({ mal_id }) => mal_id).join(",")
          : [];
        const genresMalIdListString = [
          ...genresValueRef.current,
          ...themesValueRef.current,
        ]
          .map(({ mal_id }) => mal_id)
          .join(",");
        const genresExcludeMalIdListString = genresExcludeValueRef.current
          .map(({ mal_id }) => mal_id)
          .join(",");
        const ans = {
          page: 1,
          q: textRef.current ? textRef.current.value : "",
          sort: sortValueRef.current,
          status: statusValueRef.current,
          type: typeValueRef.current,
          orderBy: orderByValueRef.current,
          rating: ratingValueRef.current,
          producer: producerMalIdListString,
          genresExclude: genresExcludeMalIdListString,
          genres: genresMalIdListString,
          maxScore: maxScoreRef.current,
          minScore: minScoreRef.current,
          isSfw: sfwRef.current ? sfwRef.current.checked : "",
          letter: letterRef.current ? letterRef.current.value : "",
          searchBy: searchByRef.current,
        };
        const {
          page,
          genres,
          genresExclude,
          maxScore,
          minScore,
          orderBy,
          producer,
          q,
          rating,
          sort,
          status,
          type,
          score,
          letter,
          isSfw,
          searchBy,
        } = ans;
        history.push(
          `/storage?page=${page}${searchBy !== "anime" ? `&${searchBy}` : ""}${
            q ? `&q=${q}` : ""
          }${type ? `&type=${type}` : ""}${rating ? `&rating=${rating}` : ""}${
            status ? `&status=${status}` : ""
          }${orderBy ? `&order_by=${orderBy}` : ""}${
            orderBy && sort ? `&sort=${sort}` : ""
          }${score ? `&score=${score}` : ""}${
            maxScore ? `&max_score=${maxScore}` : ""
          }${minScore ? `&min_score=${minScore}` : ""}${isSfw ? `&sfw` : ""}${
            genres ? `&genres=${genres}` : ""
          }${genresExclude ? `&genres_exclude=${genresExclude}` : ""}${
            producer ? `&producers=${producer}` : ""
          }${letter ? `&letter=${letter}` : ""}`
        );
      }
    );
    return () => {
      subscription.unsubscribe();
      subscriptionInit.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="filter-anime-container">
      <div className="filter-anime-wrapper">
        <h2 className="filter-anime-title">Filter</h2>
        <CustomSelect
          label={"Search by"}
          dataOptions={[
            "anime",
            "characters",
            { mal_id: "people", name: "voice actors" },
          ]}
          valueRef={searchByRef}
          defaultValue={searchByRef.current}
          triggerReset={triggerReset}
          setValue={setSearchByState}
        />
        <fieldset className="filter-anime-input-container">
          <legend className="label-select2">Key</legend>
          <div
            className="input-section-container"
            onClick={() => {
              textRef.current.focus();
            }}
          >
            <input
              ref={textRef}
              placeholder={"Search key"}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  buttonFilterRef.current.dispatchEvent(
                    new CustomEvent("click")
                  );
                }
              }}
            />
          </div>
        </fieldset>

        <fieldset className="filter-anime-input-container">
          <legend className="label-select2">Entry</legend>
          <div
            className="input-section-container"
            onClick={() => {
              letterRef.current.focus();
            }}
          >
            <input
              ref={letterRef}
              placeholder={"Search entry"}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  buttonFilterRef.current.dispatchEvent(
                    new CustomEvent("click")
                  );
                }
              }}
            />
          </div>
        </fieldset>

        {!["characters", "people"].includes(searchByState) && (
          <CustomSelect2
            url={"https://api.jikan.moe/v4/producers"}
            valueRef={producerValueRef}
            label={"Producers"}
            triggerReset={triggerReset}
            defaultValue={producerValueRef.current}
          />
        )}

        {!["characters", "people"].includes(searchByState) && (
          <CustomSelect2
            dataOptions={storageAnimeStore.currentState().genresDataOptionsList}
            label={"Genres"}
            valueRef={genresValueRef}
            triggerReset={triggerReset}
            defaultValue={genresValueRef.current}
          />
        )}

        {!["characters", "people"].includes(searchByState) && (
          <CustomSelect2
            dataOptions={storageAnimeStore.currentState().themesDataOptionsList}
            label={"Themes"}
            valueRef={themesValueRef}
            triggerReset={triggerReset}
            defaultValue={themesValueRef.current}
          />
        )}

        {!["characters", "people"].includes(searchByState) && (
          <CustomSelect2
            dataOptions={storageAnimeStore.currentState().genresDataOptionsList}
            label={"Genres Exclude"}
            valueRef={genresExcludeValueRef}
            triggerReset={triggerReset}
            defaultValue={genresExcludeValueRef.current}
          />
        )}

        {!["characters", "people"].includes(searchByState) && (
          <CustomSelect
            dataOptions={storageAnimeStore.currentState().ratingOptionsList}
            label={"Rating"}
            valueRef={ratingValueRef}
            triggerReset={triggerReset}
          />
        )}

        {!["characters", "people"].includes(searchByState) && (
          <CustomSelect
            dataOptions={Array.from(Array(10).keys())
              .map((key) => (key + 1).toString())
              .slice(0, maxScoreState - 1)}
            label={"Min score"}
            valueRef={minScoreRef}
            triggerReset={triggerReset}
            setValue={setMinScoreState}
            defaultOption={"0"}
          />
        )}

        {!["characters", "people"].includes(searchByState) && (
          <CustomSelect
            dataOptions={Array.from(Array(9).keys())
              .map((key) => (key + 1).toString())
              .slice(minScoreState, 10)}
            label={"Max score"}
            valueRef={maxScoreRef}
            triggerReset={triggerReset}
            setValue={setMaxScoreState}
            defaultOption={"10"}
          />
        )}

        {!["characters", "people"].includes(searchByState) && (
          <CustomSelect
            dataOptions={storageAnimeStore.currentState().statusOptionsList}
            label={"Status"}
            valueRef={statusValueRef}
            triggerReset={triggerReset}
          />
        )}

        {!["characters", "people"].includes(searchByState) && (
          <CustomSelect
            dataOptions={storageAnimeStore.currentState().typeOptionsList}
            label={"Type"}
            valueRef={typeValueRef}
            triggerReset={triggerReset}
          />
        )}

        {!["characters", "people"].includes(searchByState) && (
          <fieldset className="fieldset-filter-button">
            <legend className="label-select">Sfw</legend>
            <input
              className="filter-check-box"
              ref={sfwRef}
              type={"checkbox"}
            />
          </fieldset>
        )}

        <fieldset className="custom-select-container">
          <CustomSelect
            dataOptions={
              "characters" === searchByState
                ? storageAnimeStore.currentState().orderByCharacterOptionsList
                : searchByState === "people"
                ? storageAnimeStore.currentState().orderByVoiceActorOptionsList
                : storageAnimeStore.currentState().orderByOptionsList
            }
            label={"Order By"}
            valueRef={orderByValueRef}
            triggerReset={triggerReset}
            setValue={setOrderByState}
          />
          {orderByState && (
            <CustomSelect
              dataOptions={storageAnimeStore.currentState().sortOptionsList}
              label={"Sort"}
              valueRef={sortValueRef}
              triggerReset={triggerReset}
              defaultValue={sortValueRef.current}
            />
          )}
        </fieldset>

        <fieldset className="fieldset-filter-button">
          <button className="button-filter-anime" ref={buttonFilterRef}>
            Search
          </button>
          <button
            className="button-filter-anime"
            onClick={() => {
              typeValueRef.current = "";
              statusValueRef.current = "";
              sortValueRef.current = "asc";
              ratingValueRef.current = "";
              orderByValueRef.current = "";
              letterRef.current.value = "";
              textRef.current.value = "";
              minScoreRef.current = "";
              maxScoreRef.current = "";
              sfwRef.current && (sfwRef.current.checked = false);
              producerValueRef.current = [];
              genresExcludeValueRef.current = [];
              genresValueRef.current = [];
              setOrderByState(false);
              setTriggerReset(!triggerReset);
            }}
          >
            Reset
          </button>
        </fieldset>
      </div>
    </div>
  );
};

export default FilterAnime;
