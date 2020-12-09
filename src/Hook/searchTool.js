import { useEffect } from "react";
import { initSearchTool } from "../Functions/searchTool";

export const useInitSearchTool = (setSearchToolState) => {
  useEffect(initSearchTool(setSearchToolState), []);
};
