import "./Genres.css";
import React from "react";
import { Link } from "react-router-dom";
const genresData = [
  { genreId: "1", genre: "Action" },
  { genreId: "2", genre: "Adventure" },
  { genreId: "3", genre: "Cars" },
  { genreId: "4", genre: "Comedy" },
  { genreId: "5", genre: "Dementia" },
  { genreId: "6", genre: "Demons" },
  { genreId: "7", genre: "Mystery" },
  { genreId: "8", genre: "Drama" },
  { genreId: "9", genre: "Ecchi" },
  { genreId: "10", genre: "Fantasy" },
  { genreId: "11", genre: "Game" },
  { genreId: "13", genre: "Historical" },
  { genreId: "14", genre: "Horror" },
  { genreId: "15", genre: "Kids" },
  { genreId: "16", genre: "Magic" },
  { genreId: "17", genre: "Martial Arts" },
  { genreId: "18", genre: "Mecha" },
  { genreId: "19", genre: "Music" },
  { genreId: "20", genre: "Parody" },
  { genreId: "21", genre: "Samurai" },
  { genreId: "22", genre: "Romance" },
  { genreId: "23", genre: "School" },
  { genreId: "24", genre: "Sci Fi" },
  { genreId: "25", genre: "Shoujo" },
  { genreId: "26", genre: "Shoujo Ai" },
  { genreId: "27", genre: "Shounen" },
  { genreId: "28", genre: "Shounen Ai" },
  { genreId: "29", genre: "Space" },
  { genreId: "30", genre: "Sports" },
  { genreId: "31", genre: "Super Power" },
  { genreId: "32", genre: "Vampire" },
  { genreId: "33", genre: "Yaoi" },
  { genreId: "34", genre: "Yuri" },
  { genreId: "35", genre: "Harem" },
  { genreId: "36", genre: "Slice Of Life" },
  { genreId: "37", genre: "Supernatural" },
  { genreId: "38", genre: "Military" },
  { genreId: "39", genre: "Police" },
  { genreId: "40", genre: "Psychological" },
  { genreId: "41", genre: "Thriller" },
  { genreId: "42", genre: "Seinen" },
  { genreId: "43", genre: "Josei" },
];
const Genres = () => {
  return (
    <section className="genre-section">
      <h1>Genres</h1>
      <div className="container-genre-list">
        {genresData.map(
          (data) =>
            data.genreId !== "12" && (
              <Link
                to={`/genre/${data.genreId}/${data.genre.toLowerCase()}`}
                key={data.genreId}
              >
                {data.genre}
              </Link>
            )
        )}
      </div>
    </section>
  );
};

export default Genres;
