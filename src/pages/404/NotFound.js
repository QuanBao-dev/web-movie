import "./NotFound.css";
import React, { useEffect } from "react";
const NotFound = () => {
  useEffect(() => {
    document.querySelector(".nav-bar").style.display = "none";
    return () => {
      document.querySelector(".nav-bar").style.display = "block";
    };
  }, []);
  return (
    <section className="container-error-404">
      <h1>404 Page Not Found</h1>
    </section>
  );
};

export default NotFound;
