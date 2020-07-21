import "./Home.css";

import React, { useEffect, useRef, useState } from "react";

import {
  changeCurrentPage$,
  fetchAnimeSeason$,
  stream,
  changeYear$,
  changeSeason$,
} from "../../epics/todo";
import Input from "../Input/Input";

const middleWare = (todoState) => {
  if (todoState.currentPage > todoState.maxPage) {
    todoState.currentPage = todoState.maxPage;
  }
};

function Home() {
  const [todoState, setTodoState] = useState(stream.initialState);
  const searchInput = useRef(null);
  const selectYear = useRef(null);
  const selectSeason = useRef(null);

  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    scroll({
      top: 0,
      behavior: "smooth",
    });
    const subscription = stream.subscribe((v) => setTodoState(v));
    stream.init();

    const subscription2 = fetchAnimeSeason$(
      todoState.year,
      todoState.season,
      todoState.currentPage,
      todoState.numberOfProduct
    ).subscribe();
    const subscription3 = changeCurrentPage$().subscribe();

    const subscription4 = changeYear$(selectYear.current).subscribe();

    const subscription5 = changeSeason$(selectSeason.current).subscribe();

    return () => {
      subscription.unsubscribe();
      subscription2.unsubscribe();
      subscription3.unsubscribe();
      subscription4.unsubscribe();
      subscription5.unsubscribe();
    };
  }, [
    todoState.currentPage,
    todoState.numberOfProduct,
    todoState.season,
    todoState.year,
    todoState.error,
  ]);
  console.log(todoState);
  middleWare(todoState);
  if (todoState.error) {
    return (
      <div className="block-popup" style={{ display: "block" }}>
        <h1>Sorry, Something go wrong</h1>
      </div>
    );
  }
  return (
    <div>
      <div
        className="block-popup"
        style={{
          display:
            !todoState.isLoading && todoState.maxPage !== todoState.currentPage
              ? "block"
              : "none",
        }}
      >
        <h1>Loading...</h1>
      </div>
      <h2>Max page: {todoState.maxPage}</h2>
      <div style={{ margin: "auto", width: "80%", textAlign: "center" }}>
        <h2 className="new-page__title">Page {todoState.currentPage}</h2>
        <select defaultValue={`${todoState.season}`} ref={selectSeason}>
          <option value="spring">spring</option>
          <option value="summer">summer</option>
          <option value="fall">fall</option>
          <option value="winter">winter</option>
        </select>
        <select defaultValue={`${todoState.year}`} ref={selectYear}>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
          <option value="2018">2018</option>
          <option value="2017">2017</option>
        </select>
      </div>
      <div style={{ width: "300px", margin: "10px 50px" }}>
        <Input label="Search" input={searchInput} />
      </div>

      <div className="list-anime">
        {todoState.dataDetail.map((anime, index) => {
          return (
            <div key={index} className="anime-item">
              <span>{anime.title}</span>
              <div>{anime.airing_start}</div>
              <a href={anime.url}>
                <img src={anime.image_url} alt="NOT_FOUND" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
