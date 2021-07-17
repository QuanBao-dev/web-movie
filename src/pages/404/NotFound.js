import "./NotFound.css";

import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

const NotFound = () => {
  const history = useHistory();
  useEffect(() => {
    document.querySelector(".nav-bar").style.display = "none";
    const timeout = setTimeout(() => {
      history.push("/");
    }, 3000);
    return () => {
      clearTimeout(timeout);
      document.querySelector(".nav-bar").style.display = "block";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className="container-error-404">
      <h1>404 Page Not Found</h1>
    </section>
  );
};

export default NotFound;
