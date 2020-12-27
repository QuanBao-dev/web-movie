import Axios from "axios";
import React from "react";
import { useRef } from "react";
import { NavLink as Link, useHistory, withRouter } from "react-router-dom";

import { userStream } from "../../epics/user";

const NavBar = ({ userState, removeCookie, cookies }) => {
  const navLoginRef = useRef();
  const navRegisterRef = useRef();
  const history = useHistory();
  return (
    <nav className="nav-bar">
      <ul className="nav-bar__app">
        <div
          className="toggle-show__nav"
          onClick={() => {
            const e = document
              .getElementsByClassName("child-nav-bar__app")
              .item(0);
            if (e.style.display === "none") {
              e.style.display = "flex";
            } else {
              e.style.display = "none";
            }
          }}
        >
          <i className="fas fa-bars fa-3x"></i>
        </div>
        <ul className="child-nav-bar__app">
          <li className="nav-bar__item">
            <Link to="/" activeClassName="active" exact>
              Home
            </Link>
          </li>

          {userState && userState.role === "Admin" && (
            <li className="nav-bar__item">
              <Link to="/admin" activeClassName="active">
                Admin
              </Link>
            </li>
          )}

          {userState && (
            <li className="nav-bar__item">
              <Link to="/theater" activeClassName="active">
                Theater
              </Link>
            </li>
          )}
          <li
            style={{ color: "white", cursor: "pointer" }}
            className="left-nav-item nav-bar__item"
          >
            <Link to="/faq" activeClassName="active">
              FAQ
            </Link>
          </li>
          <li className="nav-bar__item" ref={navLoginRef}>
            {!userState && (
              <Link
                to="/auth/login"
                activeClassName="active"
                onClick={() => {}}
              >
                Login
              </Link>
            )}
            {userState && (
              <div
                style={{
                  color: "white",
                  cursor: "pointer",
                  display: "inline",
                  padding: "10px",
                }}
                onClick={async() => {
                  await logoutUser(removeCookie, cookies.idCartoonUser);
                  history.push("/auth/login");
                }}
              >
                Logout
              </div>
            )}
          </li>

          {!userState && (
            <li ref={navRegisterRef} className="nav-bar__item">
              <Link to="/auth/register" activeClassName="active">
                Register
              </Link>
            </li>
          )}
          {userState && (
            <li
              style={{ color: "white", cursor: "pointer" }}
              className="nav-bar__item"
            >
              <Link to={`/edit`}>{userState.username}</Link>
            </li>
          )}
          {userState && (
            <li className="nav-bar__item">
              <div
                style={{
                  color: "white",
                  cursor: "pointer",
                  display: "inline",
                }}
              >
                <img
                  className="avatar-user"
                  src={
                    !userState.avatarImage
                      ? "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png"
                      : userState.avatarImage
                  }
                  alt="avatar_user"
                  onClick={() => {
                    document.querySelector(".input-choose-avatar").click();
                  }}
                />
                <input
                  className="input-choose-avatar"
                  type="file"
                  onChange={async (e) => {
                    try {
                      if (
                        !["image/png", "image/jpeg", "image/gif"].includes(
                          e.target.files[0].type
                        )
                      ) {
                        return alert("You just can upload image");
                      }
                      const file = await convertImgToBase64(e.target.files[0]);
                      const res = await Axios.put(
                        "/api/users/current/avatar",
                        {
                          avatarImage: file.target.result,
                        },
                        {
                          headers: {
                            authorization: `Bearer ${cookies.idCartoonUser}`,
                          },
                        }
                      );
                      userStream.updateAvatarUser(res.data.message);
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                />
              </div>
            </li>
          )}
        </ul>
      </ul>
    </nav>
  );
};

async function logoutUser(removeCookie, cookie) {
  try {
    await Axios.delete("/api/users/logout", {
      headers: {
        authorization: `Bearer ${cookie}`,
      },
    });
    removeCookie("idCartoonUser", {
      path: "/",
    });
    userStream.updateUser(undefined);
    // window.location.replace("/");
  } catch (error) {}
}

async function convertImgToBase64(files) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (fileContent) => {
      res(fileContent);
    };

    reader.onerror = (error) => {
      rej(error);
    };
    reader.readAsDataURL(files);
  });
}

export default withRouter(NavBar);