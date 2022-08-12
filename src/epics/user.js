import { asyncScheduler, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, throttleTime } from 'rxjs/operators';

import userStore from '../store/user';

export const userStream = userStore;

export const fetchingUser$ = (idCartoonUser) => {
  return ajax({
    headers: {
      authorization: `Bearer ${idCartoonUser || ""}`,
    },
    method: "GET",
    url: "/api",
  }).pipe(
    throttleTime(1000,asyncScheduler,{
      leading:true,
      trailing:true
    }),
    catchError((error) => {
      userStream.updateUser(userStream.initialState);
      return of({error})
    })
  );
}