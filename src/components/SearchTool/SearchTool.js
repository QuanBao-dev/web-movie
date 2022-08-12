import loadable from "@loadable/component";
import React from "react";
import { useState } from "react";
import { searchToolStream } from "../../epics/searchTool";
import { useInitSearchTool } from "../../Hook/searchTool";
const SearchInput = loadable(
  () => import("../../components/SearchInput/SearchInput"),
  {
    fallback: (
      <div style={{ textAlign: "center" }}>
        <i className="fas fa-spinner fa-9x fa-spin"></i>
      </div>
    ),
  }
);

const SearchedAnimeList = loadable(() =>
  import("../../components/SearchedAnimeList/SearchedAnimeList")
);

function SearchTool() {
  const [searchToolState, setSearchToolState] = useState(
    searchToolStream.currentState()
  );
  useInitSearchTool(setSearchToolState);
  return (
    <div style={{ width: "100%" }}>
      <SearchInput textSearch={searchToolState.textSearch} />
      <SearchedAnimeList
        textSearch={searchToolState.textSearch}
        dataSearch={searchToolState.dataSearch}
      />
    </div>
  );
}

export default SearchTool;
