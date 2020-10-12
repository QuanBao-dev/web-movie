import "./CharacterItem.css";

import React from "react";

import { characterStream } from "../../epics/character";
import { LazyLoadImage } from "react-lazy-load-image-component";

function CharacterItem({ characterData, history, lazy }) {
  return (
    <div
      className={`character-item${
        characterData.role === "Main" ? " border-yellow" : ""
      }`}
      onClick={() => {
        characterStream.updateRole(characterData.role);
        history.push(`/anime/character/${characterData.mal_id}`);
      }}
    >
      {!lazy && (
        <img
          className="character-image"
          src={characterData.image_url}
          alt="image_character"
        />
      )}
      {lazy && (
        <LazyLoadImage
          className="character-image"
          src={characterData.image_url}
          alt="image_character"
        />
      )}
      <div className="name-character">{characterData.name}</div>
    </div>
  );
}
export default CharacterItem;
