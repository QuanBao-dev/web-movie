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
    <div className="container-error-404">
      <h1>404 Page Not Found</h1>
    </div>
  );
};

export default NotFound;
