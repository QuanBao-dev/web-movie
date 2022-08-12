import adminStore from "../store/admin";
import { timer, from, of, fromEvent } from "rxjs";
import {
  map,
  pluck,
  combineAll,
  startWith,
  catchError,
  exhaustMap,
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";
export const adminStream = adminStore;

export const listenChangeFilter$ = (
  usernameElement,
  roleElement,
  dateStartElement,
  dateEndElement,
  users
) => {
  const listElement = [
    usernameElement,
    roleElement,
    dateStartElement,
    dateEndElement,
  ];
  const source$ = listElement.map((element) => {
    return fromEvent(element, "change").pipe(startWith(""));
  });
  return from(source$).pipe(
    combineAll(),
    map(([eventUsername, eventRole, eventDateStart, eventDateEnd]) => {
      let dataFilter = createDataFilter(
        eventUsername.target,
        eventRole.target,
        eventDateStart.target,
        eventDateEnd.target
      );
      let userFilter = filterUsers(users, dataFilter);
      if (Object.keys(dataFilter).length !== 0) {
        adminStream.updateUsersFilter(userFilter);
      }
      return userFilter;
    })
  );
};

export const fetchAllUsers$ = (idCartoonUser) => {
  return timer(0).pipe(
    exhaustMap(() =>
      ajax({
        url: "/api/users",
        headers: {
          authorization: `Bearer ${idCartoonUser}`,
        },
      }).pipe(
        pluck("response", "message"),
        catchError((error) => {
          return of({ error });
        })
      )
    )
  );
};
export function filterUsers(users, dataFilter) {
  let userFilter = [...users];
  if (dataFilter.username) {
    userFilter = userFilter.filter((user) =>
      new RegExp(dataFilter.username, "i").test(user.username)
    );
  }
  if (dataFilter.role) {
    userFilter = userFilter.filter((user) => {
      return user.role === dataFilter.role;
    });
  }
  if (dataFilter.dateStart) {
    userFilter = userFilter.filter(
      (user) =>
        new Date(dataFilter.dateStart).getTime() <=
        new Date(user.createdAt).getTime()
    );
  }
  if (dataFilter.dateEnd) {
    userFilter = userFilter.filter(
      (user) =>
        new Date(dataFilter.dateEnd).getTime() >=
        new Date(user.createdAt).getTime()
    );
  }
  return userFilter;
}

export function createDataFilter(
  elementUsername,
  elementRole,
  elementDateStart,
  elementDateEnd
) {
  let dataFilter = {};
  if (elementUsername) {
    dataFilter = { ...dataFilter, username: elementUsername.value };
  }
  if (elementRole) {
    dataFilter = { ...dataFilter, role: elementRole.value };
  }
  if (elementDateStart) {
    dataFilter = { ...dataFilter, dateStart: elementDateStart.value };
  }
  if (elementDateEnd) {
    dataFilter = { ...dataFilter, dateEnd: elementDateEnd.value };
  }
  return dataFilter;
}
