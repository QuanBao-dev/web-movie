import React from "react";
import { characterStream } from "../../epics/character";
function CharacterItem({characterData, index, history}) {
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
      <img
        className="character-image"
        src={characterData.image_url}
        alt="image_character"
      />
      <div className="name-character">{characterData.name}</div>
    </div>
  );
}
export default CharacterItem