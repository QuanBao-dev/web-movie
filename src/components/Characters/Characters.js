import "./Characters.css";

import loadable from "@loadable/component";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { catchError, pluck, retry } from "rxjs/operators";

import { characterStream } from "../../epics/character";

const CharacterItem = loadable(() => import("../CharacterItem/CharacterItem"));
const Characters = ({ malId, lazy = false }) => {
  const history = useHistory();
  const [dataCharacterState, setDataCharacterState] = useState([]);
  const [charactersState, setCharactersState] = useState(
    characterStream.initialState
  );
  useEffect(() => {
    const subscription = fetchDataCharacter$(malId).subscribe((data) => {
      setDataCharacterState(data);
    });
    characterStream.updatePage(1);
    return () => {
      subscription.unsubscribe();
    };
  }, [malId]);
  useEffect(() => {
    const initSub = characterStream.subscribe(setCharactersState);
    characterStream.init();
    return () => {
      initSub.unsubscribe();
    };
  }, [charactersState.page]);
  // console.log(dataCharacterState);
  useEffect(() => {
    const buttonSeemore = document.querySelector(".see-more-character");
    if (buttonSeemore) {
      if (
        characterStream.currentState().page *
          characterStream.currentState().numberDisplay >=
        dataCharacterState.length
      )
        buttonSeemore.style.display = "none";
      else {
        buttonSeemore.style.display = "block";
      }
    }
  }, [dataCharacterState.length, charactersState.page]);
  return (
    dataCharacterState.length > 0 && (
      <div>
        <h1 className="title">Characters</h1>
        {characterStream.currentState() && (
          <div className="character-list">
            {dataCharacterState
              .slice(
                0,
                characterStream.currentState().page *
                  characterStream.currentState().numberDisplay
              )
              .map((characterData, index) => (
                <CharacterItem
                  key={index}
                  lazy={lazy}
                  characterData={characterData}
                  history={history}
                />
              ))}
            <div
              className="see-more-character"
              onClick={() => {
                const page = characterStream.currentState().page;
                characterStream.updatePage(page + 1);
              }}
            >
              See more
            </div>
          </div>
        )}
      </div>
    )
  );
};

function fetchDataCharacter$(malId) {
  return ajax(`https://api.jikan.moe/v3/anime/${malId}/characters_staff`).pipe(
    retry(20),
    pluck("response", "characters"),
    catchError(() => of([]))
  );
}

export default Characters;
