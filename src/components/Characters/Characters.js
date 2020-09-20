import "./Characters.css";
import React, { useEffect, useState } from "react";
import { ajax } from "rxjs/ajax";
import { catchError, pluck, retry } from "rxjs/operators";
import { of } from "rxjs";
import { useHistory } from "react-router-dom";
import { characterStream } from "../../epics/character";
const Characters = ({ malId }) => {
  const history = useHistory();
  const [dataCharacterState, setDataCharacterState] = useState([]);
  const [charactersState, setCharactersState] = useState(
    characterStream.initialState
  );
  useEffect(() => {
    window.scroll({
      top:0,
      behavior:"smooth"
    })
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
                <div
                  className={`character-item${
                    characterData.role === "Main" ? " border-yellow" : ""
                  }`}
                  key={index}
                  onClick={() => {
                    characterStream.updateRole(characterData.role);
                    history.push(
                      `/anime/character/${characterData.mal_id}`
                    );
                  }}
                >
                  <img
                    className="character-image"
                    src={characterData.image_url}
                    alt="NOT FOUND"
                  />
                  <div className="name-character">{characterData.name}</div>
                </div>
              ))}
            <button
              className="see-more-character"
              onClick={(e) => {
                const page = characterStream.currentState().page;
                characterStream.updatePage(page + 1);
                e.target.scrollIntoView({
                  block: "end",
                  inline: "nearest",
                });
              }}
            >
              See more
            </button>
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
