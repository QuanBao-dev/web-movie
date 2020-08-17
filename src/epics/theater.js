import { from, fromEvent, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { tap, catchError, combineAll, filter, map, pluck, switchMap } from 'rxjs/operators';

import theaterStore from '../store/theater';

export const theaterStream = theaterStore;
export const validateForm$ = (buttonSubmitElement, ...elements) => {
  buttonSubmitElement.disabled = true;
  return from(
    elements.map((element) => {
      return fromEvent(element, "input");
    })
  ).pipe(
    combineAll(),
    map((events) => {
      let check = true;
      const valueInputs = events.map((event) => {
        if (event.target.value.length === 0) {
          check = false;
        }
        return event.target.value;
      });
      if (check) {
        buttonSubmitElement.disabled = false;
      } else {
        buttonSubmitElement.disabled = true;
      }
      return valueInputs;
    })
  );
};

export const fetchRoomsData$ = (idCartoonUser) => {
  return ajax({
    url: `/api/theater`,
    headers: {
      authorization: `Bearer ${idCartoonUser}`,
    },
    method: "GET",
  }).pipe(
    pluck("response", "message"),
    catchError(() => of([]))
  );
};

export const submitFormPasswordRoom$ = (
  inputElement,
  groupId,
  idCartoonUser
) => {
  return fromEvent(inputElement, "keydown").pipe(
    filter((e) => e.keyCode === 13),
    tap(() => console.log("submit")),
    pluck("target", "value"),
    switchMap((password) =>
      ajax({
        method: "POST",
        url: `/api/theater/${groupId}/join`,
        headers: {
          authorization: `Bearer ${idCartoonUser}`,
        },
        body: {
          password: password,
        },
      }).pipe(
        catchError((error) => {
          alert(error.response.message);
          return of(null)
        })
      )
    )
  );
};
