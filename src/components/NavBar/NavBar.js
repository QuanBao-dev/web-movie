import "./NavBar.css";

import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { NavLink as Link, useHistory, withRouter } from "react-router-dom";

import { userStream } from "../../epics/user";
import { fromEvent } from "rxjs";

const NavBar = ({ userState, removeCookie, cookies }) => {
  const [isShowToggleNav, setIsShowToggleNav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navLoginRef = useRef();
  const navRegisterRef = useRef();
  const buttonScrollTopRef = useRef();
  const history = useHistory();
  const navBarAppRef = useRef();
  const childNavBarAppRef = useRef();
  const posY1 = useRef(0);
  const posY2 = useRef(0);
  useEffect(() => {
    if (document.body.offsetWidth > 1186) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
    const subscription = fromEvent(window, "resize").subscribe(() => {
      if (document.body.offsetWidth > 1186) {
        setIsMobile(false);
      } else {
        setIsMobile(true);
      }
    });
    const subscription2 = fromEvent(window, "scroll").subscribe(() => {
      posY2.current = posY1.current - window.scrollY;
      if (window.scrollY < 50) {
        navBarAppRef.current.style.transform = "translateY(0)";
        navBarAppRef.current.style.backgroundColor = "rgba(2, 2, 2)";
        buttonScrollTopRef.current.style.transform = "translateY(500px)";
      }
      if (posY1.current) {
        if (posY2.current < -1 && window.scrollY >= 50) {
          navBarAppRef.current.style.transform = "translateY(-500px)";
          if (
            childNavBarAppRef.current.style.display !== "flex" &&
            document.body.offsetWidth <= 1186
          )
            navBarAppRef.current.style.backgroundColor = "rgba(2, 2, 2, 0.3)";
          if (
            childNavBarAppRef.current.style.display === "flex" &&
            document.body.offsetWidth <= 1186
          )
            childNavBarAppRef.current.style.display = "none";
          if (document.body.offsetWidth > 1186) {
            navBarAppRef.current.style.backgroundColor = "rgba(2, 2, 2, 0.3)";
          }
          buttonScrollTopRef.current.style.transform = "translateY(500px)";
        }

        if (posY2.current > 1 && window.scrollY >= 50) {
          navBarAppRef.current.style.transform = "translateY(0)";
          buttonScrollTopRef.current.style.transform = "translateY(0)";
          if (childNavBarAppRef.current.style.display !== "flex") {
            navBarAppRef.current.style.backgroundColor = "rgba(2, 2, 2, 0.3)";
          }
        }
      }
      posY1.current = window.scrollY;
    });
    return () => {
      subscription.unsubscribe();
      subscription2.unsubscribe();
    };
  }, []);
  return (
    <nav className="nav-bar">
      <div
        ref={buttonScrollTopRef}
        className="button-scroll-top"
        onClick={() => {
          window.scroll({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        <i className="fas fa-arrow-up fa-2x"></i>
      </div>
      <ul
        className="nav-bar__app"
        ref={navBarAppRef}
        onMouseMove={() => {
          navBarAppRef.current.style.backgroundColor = "black";
        }}
        onMouseLeave={() => {
          if (window.scrollY >= 50)
            navBarAppRef.current.style.backgroundColor = "rgb(2,2,2,0.2)";
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "0.3rem",
          }}
        >
          <div
            className="logo"
            onClick={() => {
              setIsShowToggleNav(false);
            }}
          >
            <Link to="/">
              <div className="logo-wrapper">
                <img
                  src="https://myanimefun.herokuapp.com/logo192.png"
                  width={50}
                  height={50}
                  alt=""
                ></img>
                <span>MyAnimeFun</span>
              </div>
            </Link>
          </div>
          <div
            className="toggle-show__nav"
            style={{
              backgroundColor: "transparent",
            }}
            onClick={() => {
              setIsShowToggleNav(!isShowToggleNav);
            }}
          >
            <i className="fas fa-bars fa-2x"></i>
          </div>
        </div>
        <ul
          ref={childNavBarAppRef}
          className="child-nav-bar__app"
          style={{
            display: !isMobile || isShowToggleNav ? "flex" : "none",
          }}
        >
          <li
            className="left-nav-item nav-bar__item"
            onClick={() => {
              setIsShowToggleNav(false);
            }}
          >
            <Link to="/" activeClassName="active" exact>
              Home
            </Link>
          </li>

          <li
            className="nav-bar__item"
            onClick={() => {
              setIsShowToggleNav(false);
            }}
          >
            <Link to="/storage" activeClassName="active" exact>
              Storage
            </Link>
          </li>

          {userState && userState.role === "Admin" && (
            <li
              className="nav-bar__item"
              onClick={() => {
                setIsShowToggleNav(false);
              }}
            >
              <Link to="/requests" activeClassName="active">
                Request
              </Link>
            </li>
          )}

          {userState && userState.role === "Admin" && (
            <li className="nav-bar__item">
              <Link to="/admin" activeClassName="active">
                Admin
              </Link>
            </li>
          )}

          <li
            className="nav-bar__item"
            onClick={() => {
              setIsShowToggleNav(false);
            }}
          >
            {userState && (
              <Link to="/theater" activeClassName="active">
                Theater
              </Link>
            )}
            {!userState && (
              <span
                style={{ cursor: "pointer" }}
                onClick={() => {
                  alert("Require Login");
                }}
              >
                Theater
              </span>
            )}
          </li>
          <li
            style={{ color: "white", cursor: "pointer" }}
            className="nav-bar__item"
            onClick={() => {
              setIsShowToggleNav(false);
            }}
          >
            <Link to="/faq" activeClassName="active">
              FAQ
            </Link>
          </li>
          <li
            className="nav-bar__item"
            ref={navLoginRef}
            onClick={() => {
              setIsShowToggleNav(false);
            }}
          >
            {!userState && (
              <Link to="/auth/login" activeClassName="active">
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
                onClick={async () => {
                  await logoutUser(removeCookie, cookies.idCartoonUser);
                  history.push("/auth/login");
                }}
              >
                Logout
              </div>
            )}
          </li>

          {!userState && (
            <li
              ref={navRegisterRef}
              className="nav-bar__item"
              onClick={() => {
                setIsShowToggleNav(false);
              }}
            >
              <Link to="/auth/register" activeClassName="active">
                Register
              </Link>
            </li>
          )}
          {userState && (
            <li
              style={{ color: "white", cursor: "pointer" }}
              className="nav-bar__item"
              onClick={() => {
                setIsShowToggleNav(false);
              }}
            >
              <Link to={`/edit`}>{userState.username}</Link>
            </li>
          )}
          {userState && (
            <li
              className="nav-bar__item"
              onClick={() => {
                setIsShowToggleNav(false);
              }}
            >
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
                      console.error(error);
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
