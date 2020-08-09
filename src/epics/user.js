import userStore from "../store/user";
import { ajax } from 'rxjs/ajax';
import { throttleTime, tap, catchError } from "rxjs/operators";
import { of, asyncScheduler } from "rxjs";
export const userStream = userStore;

export const fetchingUser$ = (idCartoonUser) => {
  return ajax({
    headers: {
      authorization: `Bearer ${idCartoonUser || ""}`,
    },
    method: "GET",
    url: "http://localhost:5000/api/",
  }).pipe(
    throttleTime(1000,asyncScheduler,{
      leading:true,
      trailing:true
    }),
    tap(((v) => {
      userStream.updateUser(v.response.message);
    })),
    catchError((v) => {
      userStream.updateUser(userStream.initialState);
      return of(undefined)
    })
  );
}