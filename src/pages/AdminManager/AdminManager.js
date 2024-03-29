import "./AdminManager.css";

import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";

import {
  adminStream,
  createDataFilter,
  fetchAllUsers$,
  filterUsers,
  listenChangeFilter$,
} from "../../epics/admin";
import { allowShouldFetchAllUser } from "../../store/admin";
import userStore from "../../store/user";

const AdminManager = () => {
  const [cookies] = useCookies(["idCartoonUser"]);
  const [adminState, setAdminState] = useState(adminStream.initialState);
  const [toggleState, setToggleState] = useState("all");
  const usernameRef = useRef();
  const roleRef = useRef();
  const dateStartRef = useRef();
  const dateEndRef = useRef();
  useEffect(() => {
    const buttonScrollTopE = document.querySelector(".button-scroll-top");
    buttonScrollTopE.style.display = "block";
    const subscription = adminStream.subscribe(setAdminState);
    adminStream.init();
    let fetchUsersSub;
    if (adminState.shouldFetchAllUsers) {
      fetchUsersSub = fetchAllUsers$(cookies.idCartoonUser).subscribe((v) => {
        if (!v.error) {
          adminStream.updateUsers(v);
          allowShouldFetchAllUser(false);
          const dataFilter = createDataFilter(
            usernameRef.current,
            roleRef.current,
            dateStartRef.current,
            dateEndRef.current
          );
          let userFilter = filterUsers(v, dataFilter);
          adminStream.updateUsersFilter(userFilter);
        } else {
          userStore.resetUser();
        }
      });
    }
    let listenChangeFilterSub;
    if (toggleState === "filter") {
      listenChangeFilterSub = listenChangeFilter$(
        usernameRef.current,
        roleRef.current,
        dateStartRef.current,
        dateEndRef.current,
        adminState.users
      ).subscribe();
    }
    return () => {
      subscription.unsubscribe();
      if (fetchUsersSub) {
        fetchUsersSub.unsubscribe();
      }
      if (listenChangeFilterSub) {
        listenChangeFilterSub.unsubscribe();
      }
    };
  }, [
    adminState.shouldFetchAllUsers,
    adminState.users,
    cookies.idCartoonUser,
    toggleState,
  ]);
  // console.log(adminState, toggleState);
  return (
    <div className="container-admin-session">
      <div
        style={{ display: "flex", justifyContent: "center", margin: "1rem" }}
      >
        <select
          defaultValue="all"
          onChange={(e) => {
            if (e.target.value === "all") {
              allowShouldFetchAllUser(true);
            }
            setToggleState(e.target.value);
          }}
        >
          <option value="all">Show all</option>
          <option value="filter">Filter</option>
        </select>
      </div>
      {toggleState === "filter" && (
        <div className="filter-section">
          <div className="filter-bar-controller">
            <div className="m-1">
              <label>Username: </label>
              <input type="text" ref={usernameRef} />
            </div>
            <div className="m-1">
              <label>Role: </label>
              <select ref={roleRef}>
                <option value="">All</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>
            <div className="m-1">
              <label>Date start: </label>
              <input type="Date" ref={dateStartRef} />
            </div>
            <div className="m-1">
              <label>Date end: </label>
              <input type="Date" ref={dateEndRef} />
            </div>
          </div>
        </div>
      )}
      <table className="table-user-session">
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Role</th>
            <th>CreatedAt</th>
            <th>Control</th>
          </tr>
        </thead>
        {toggleState === "all" &&
          adminState.users &&
          adminState.users.map((user, index) => {
            return (
              <tbody key={index}>
                <tr>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toUTCString()}</td>
                  {user && user.role === "User" && (
                    <td>
                      <button
                        onClick={async () => {
                          try {
                            let temp = [...adminState.users];
                            await fetch(`/api/users/${user._id}`, {
                              method: "DELETE",
                              headers: {
                                authorization: `Bearer ${cookies.idCartoonUser}`,
                              },
                            });
                            temp.splice(index, 1);
                            adminStream.updateUsers(temp);
                            allowShouldFetchAllUser(true);
                          } catch (error) {}
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              </tbody>
            );
          })}
        {toggleState === "filter" &&
          adminState.usersFilter &&
          adminState.usersFilter.map((user, index) => {
            return (
              <tbody key={index}>
                <tr>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toUTCString()}</td>
                  {user && user.role === "User" && (
                    <td>
                      <button
                        onClick={async () => {
                          try {
                            let temp = [...adminState.users];
                            await fetch(`/api/users/${user._id}`, {
                              method: "DELETE",
                              headers: {
                                authorization: `Bearer ${cookies.idCartoonUser}`,
                              },
                            });
                            allowShouldFetchAllUser(true);
                            const dataFilter = createDataFilter(
                              usernameRef.current,
                              roleRef.current,
                              dateStartRef.current,
                              dateEndRef.current
                            );
                            // console.log(dataFilter);
                            let userFilter = filterUsers(temp, dataFilter);
                            adminStream.updateUsersFilter(userFilter);
                          } catch (error) {}
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              </tbody>
            );
          })}
      </table>
    </div>
  );
};

export default AdminManager;
