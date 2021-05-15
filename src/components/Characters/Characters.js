import "./Characters.css";

import loadable from "@loadable/component";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { fromEvent } from "rxjs";

import { characterStream } from "../../epics/character";
import Input from "../Input/Input";

const CharacterItem = loadable(() => import("../CharacterItem/CharacterItem"));
const Characters = ({ lazy = false, isLoading }) => {
  const history = useHistory();
  const [charactersState, setCharactersState] = useState(
    characterStream.initialState
  );
  const searchCharacterRef = useRef();
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
        charactersState.dataCharacter.length
      )
        buttonSeemore.style.display = "none";
      else {
        buttonSeemore.style.display = "block";
      }
    }
  }, [charactersState.dataCharacter.length, charactersState.page]);

  useEffect(() => {
    const subscription = fromEvent(
      searchCharacterRef.current,
      "input"
    ).subscribe((e) => {
      characterStream.updateData({
        dataCharacter: characterStream
          .currentState()
          .dataCharacterRaw.filter(
            (characterData) =>
              !!characterData.name.match(new RegExp(e.target.value, "i"))
          ),
      });
    });
    return () => {
      characterStream.updateData({
        dataCharacter: characterStream.currentState().dataCharacterRaw,
      });
      subscription.unsubscribe();
    };
  }, []);
  return (
    <div>
      <h1 className="title">Characters</h1>
      <Input label={"Search Character"} input={searchCharacterRef} />
      {isLoading !== null && isLoading === true && (
        <CircularProgress color="secondary" size="4rem" />
      )}

      {isLoading === false && charactersState.dataCharacter.length === 0 && (
        <h3>No Character has been found</h3>
      )}

      {isLoading === false && charactersState.dataCharacter.length > 0 && (
        <div className="character-list">
          {charactersState.dataCharacter
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
  );
};

export default Characters;
