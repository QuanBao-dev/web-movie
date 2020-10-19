import './Characters.css';

import loadable from '@loadable/component';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { characterStream } from '../../epics/character';
import CircularProgress from '@material-ui/core/CircularProgress';

const CharacterItem = loadable(() => import("../CharacterItem/CharacterItem"));
const Characters = ({ lazy = false, isLoading }) => {
  const history = useHistory();
  const [charactersState, setCharactersState] = useState(
    characterStream.initialState
  );
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
  return (
    charactersState.dataCharacter.length > 0 && (
      <div>
        <h1 className="title">Characters</h1>
        {isLoading !== null &&
          isLoading === true && (
            <CircularProgress color="secondary" size="4rem" />
          )}
        {isLoading === false && characterStream.currentState() && (
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
    )
  );
};

export default Characters;
