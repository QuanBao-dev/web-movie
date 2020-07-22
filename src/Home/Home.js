import './Home.css';

import React, { useEffect, useRef, useState } from 'react';

import AnimeList from '../components/AnimeList/AnimeList';
import BlockPopUp from '../components/BlockPopUp/BlockPopUp';
import Input from '../components/Input/Input';
import PageNavList from '../components/PageNavList/PageNavList';
import SearchedAnimeList from '../components/SearchedAnimeList/SearchedAnimeList';
import {
  changeCurrentPage$,
  changeSearchInput$,
  changeSeason$,
  changeYear$,
  fetchAnimeSeason$,
  stream,
} from '../epics/todo';

const middleWare = (todoState) => {
  if (todoState.currentPage > todoState.maxPage) {
    todoState.currentPage = todoState.maxPage;
  }
};

function unsubscribeSubscription(...subscriptions) {
  subscriptions.forEach((subscription) => {
    subscription.unsubscribe();
  });
}

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
    if (searchInput.current) {
      searchInput.current.value = todoState.textSearch;
    }
    const subscription2 = fetchAnimeSeason$(
      todoState.year,
      todoState.season,
      todoState.currentPage,
      todoState.numberOfProduct
    ).subscribe();
    const subscription3 = changeCurrentPage$().subscribe();
    const subscription4 = changeYear$(selectYear.current).subscribe();
    const subscription5 = changeSeason$(selectSeason.current).subscribe();
    const subscription6 = changeSearchInput$(searchInput.current).subscribe();
    return () => {
      unsubscribeSubscription(
        subscription,
        subscription2,
        subscription3,
        subscription4,
        subscription5,
        subscription6
      );
    };
  }, [
    todoState.currentPage,
    todoState.numberOfProduct,
    todoState.season,
    todoState.year,
    todoState.dataFilter,
    todoState.textSearch,
    todoState.maxPage
  ]);
  middleWare(todoState);
  const numberOfYears = 4;
  const numberOfPagesDisplay = 5;
  const elementOptions = Array.from(Array(numberOfYears).keys()).map(
    (v) => new Date(Date.now()).getFullYear() - v
  );
  // console.log(todoState);
  const elementsLi = Array.from(Array(numberOfPagesDisplay).keys()).map((v) => {
    if (todoState.currentPage <= Math.floor(numberOfPagesDisplay / 2)) {
      return v + 1;
    } else if (
      todoState.currentPage >=
      todoState.maxPage - Math.floor(numberOfPagesDisplay / 2)
    ) {
      return todoState.maxPage - numberOfPagesDisplay + (v + 1);
    }
    return todoState.currentPage - Math.floor(numberOfPagesDisplay / 2) + v;
  });
  return (
    <div className="home-page">
      <BlockPopUp todoState={todoState} />
      <div style={{ margin: "auto", width: "80%", textAlign: "center" }}>
        <h2>Max page: {todoState.maxPage}</h2>
        <select
          style={{
            margin: "10px",
            padding: "10px",
            borderRadius: "10px",
            backgroundColor: "black",
            color: "white",
            fontSize:"150%",
            boxShadow: "2px 2px 5px 2px black",
          }}
          defaultValue={`${todoState.season}`}
          ref={selectSeason}
        >
          <option value="spring">spring</option>
          <option value="summer">summer</option>
          <option value="fall">fall</option>
          <option value="winter">winter</option>
        </select>
        <select
          style={{
            margin: "10px",
            padding: "10px",
            borderRadius: "10px",
            backgroundColor: "black",
            color: "white",
            fontSize:"150%",
            boxShadow: "2px 2px 5px 2px black",
          }}
          defaultValue={`${todoState.year}`}
          ref={selectYear}
        >
          {elementOptions.map((v, index) => {
            return (
              <option key={index} value={`${v}`}>
                {v}
              </option>
            );
          })}
        </select>
      </div>
      <div style={{ width: "300px", margin: "auto" }}>
        <Input label="Search" input={searchInput} />
      </div>
      <div style={{ margin: "auto", width: "50%", textAlign: "center" }}>
        <PageNavList
          elementsLi={elementsLi}
          stream={stream}
          todoState={todoState}
        />
      </div>
      <SearchedAnimeList todoState={todoState} />
      <AnimeList data={todoState.dataDetail} />
    </div>
  );
}

export default Home;
