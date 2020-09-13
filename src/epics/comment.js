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
  buttonSubmitElement,
  user
) => {
  buttonSubmitElement.disabled = true;
  const inputAuthor$ = fromEvent(inputAuthorElement, "input").pipe(
    pluck("target", "value"),
    startWith(user.username)
  );
  const input$ = fromEvent(inputElement, "input").pipe(
    pluck("target", "value"),
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
        url: `/api/movies/${malId}`,
      }).pipe(
        map((res) => res.response.message),
        catchError(() => of([]))
      )
    )
  );
};
