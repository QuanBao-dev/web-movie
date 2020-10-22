import { fromEvent, timer, of, from } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  map,
  switchMapTo,
  catchError,
  combineAll,
  pluck,
  startWith,
} from "rxjs/operators";

import chatStore from "../store/comment";

export const chatStream = chatStore;

export const validateInput$ = (
  inputElement,
  inputAuthorElement,
  buttonSubmitElement
) => {
  buttonSubmitElement.disabled = true;
  const inputAuthor$ = fromEvent(inputAuthorElement, "input").pipe(
    pluck("target", "value"),
    startWith(chatStream.currentState().currentName)
  );
  const input$ = fromEvent(inputElement, "input").pipe(
    pluck("target", "innerText"),
    startWith("")
  );
  return from([inputAuthor$, input$]).pipe(
    combineAll(),
    map(([inputAuthor, input]) => {
      const text = input;
      const textAuthor = inputAuthor;
      if (text.trim() === "" || textAuthor.trim() === "") {
        buttonSubmitElement.disabled = true;
      } else {
        buttonSubmitElement.disabled = false;
      }
    })
  );
};

export const fetchPageMessage$ = (malId) => {
  return timer(0).pipe( 
    switchMapTo(
      ajax({
        url: `/api/movies/${malId}?page=`+chatStream.currentState().currentPage,
      }).pipe(
        map((res) => res.response.message),
        catchError(() => of([]))
      )
    )
  );
};

export const timeSince = (date) => {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  if (Math.floor(seconds) === 1) {
    return Math.floor(seconds) + " second";
  }
  if (Math.floor(seconds) === 0) {
    return "Recently";
  }
  return Math.floor(seconds) + " seconds";
};
