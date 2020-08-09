import { fromEvent, timer, of, from } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map, switchMapTo, catchError, combineAll } from "rxjs/operators";

import chatStore from "../store/comment";

export const chatStream = chatStore;

export const validateInput$ = (
  inputElement,
  inputAuthorElement,
  buttonSubmitElement
) => {
  buttonSubmitElement.disabled = true;
  const input$ = fromEvent(inputElement, "input");
  const inputAuthor$ = fromEvent(inputAuthorElement, "input");
  return from([input$, inputAuthor$]).pipe(
    combineAll(),
    map(([input, authorInput]) => {
      const text = input.target.value;
      const textAuthor = authorInput.target.value;
      if (text === "" || textAuthor === "") {
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
        url: `http://localhost:5000/api/movies/${malId}`,
      }).pipe(
        map((res) => res.response.message),
        catchError(() => of({}))
      )
    )
  );
};
