import { from, fromEvent, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, combineAll, filter, map, pluck, startWith, switchMap, tap } from 'rxjs/operators';

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
  idCartoonUser,
  setErrorPassword
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
          if (error) {
            setErrorPassword(error.response.error);
          } else {
            setErrorPassword(null);
          }
          return of(null);
        })
      )
    )
  );
};

export const fetchUserOnline$ = (groupId, idCartoonUser) => {
  return ajax({
    url: `/api/theater/${groupId}/members`,
    headers: {
      authorization: `Bearer ${idCartoonUser}`,
    },
  }).pipe(
    pluck("response", "message"),
    catchError(() => of([]))
  );
};

export const createNewMessageDialog$ = (inputElement) => {
  return fromEvent(inputElement, "keydown").pipe(
    filter((event) => event.keyCode === 13 && event.target.value !== ""),
    pluck("target", "value"),
    tap(() => (inputElement.value = ""))
  );
};

export const createNewMessageNotSignIn$ = (user, ...elements) => {
  const elementsListen = elements.map((element) => fromEvent(element, "input"));
  elementsListen[0] = elementsListen[0].pipe(
    pluck("target", "value"),
    startWith(user ? user.username : "")
  );
  elementsListen[1] = elementsListen[1].pipe(
    pluck("target", "value"),
    startWith("")
  );
  return from(elementsListen).pipe(
    combineAll(),
    map((texts) => {
      const blankExistIndex = texts.findIndex((text) => text.trim() === "");
      return { blankExistIndex, texts };
    }),
    filter(({ blankExistIndex }) => blankExistIndex < 0),
    switchMap(({ texts }) =>
      fromEvent(document, "keydown").pipe(
        filter((e) => {
          if (e.keyCode !== 13) {
            return false;
          }
          const blankExistIndex = elements.findIndex(
            (element) => element.value.trim() === ""
          );
          return blankExistIndex >= 0 ? false : true;
        }),
        map(() => texts)
      )
    )
  );
};
