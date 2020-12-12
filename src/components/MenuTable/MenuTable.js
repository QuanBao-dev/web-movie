import React from "react";

function MenuTable({ elementTitle, toggleNavTitle }) {
  return (
    <div
      className="tag-scrolling-nav"
      style={{
        maxHeight: toggleNavTitle ? "2000px" : "0",
        boxShadow: toggleNavTitle ? "0 0 4px 1px white" : "none",
      }}
    >
      {elementTitle &&
        elementTitle.slice(1, elementTitle.length).map((e, key) => (
          <div
            key={key}
            className="tag-scrolling-nav_item"
            onClick={() => {
              e.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            {e.innerText}
          </div>
        ))}
    </div>
  );
}

export default MenuTable;