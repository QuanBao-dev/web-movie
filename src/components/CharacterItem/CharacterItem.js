import "./CharacterItem.css";

import React from "react";

import { characterStream } from "../../epics/character";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

function CharacterItem({ characterData, lazy }) {
  if (!characterData.name) return <div />;

  return (
    <Link
      to={`/anime/character/${characterData.mal_id}-${characterData.name
        .replace(/[ /%^&*(),]/g, "-")
        .toLocaleLowerCase()}`}
      className={`character-item${
        characterData.role === "Main" ? " border-yellow" : ""
      }`}
      onClick={() => {
        characterStream.updateData({ role: characterData.role });
      }}
    >
      {!lazy && (
        <img
          className="character-image"
          src={characterData.images.webp.image_url}
          alt="image_character"
        />
      )}
      {lazy && (
        <LazyLoadImage
          className="character-image"
          src={characterData.images.webp.image_url}
          alt="image_character"
          effect="opacity"
        />
      )}
      <div className="name-character">
        {characterData.name.replace(",", "")}
      </div>
    </Link>
  );
}
export default CharacterItem;
