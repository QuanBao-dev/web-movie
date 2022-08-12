import { searchToolStream } from "../epics/searchTool"

export const initSearchTool = (setSearchToolState) => {
  return () => {
    const subscription = searchToolStream.subscribe(setSearchToolState);
    searchToolStream.init();
    return () => {
      searchToolStream.updateDataQuick({
        dataSearch:[],
        textSearch:""
      })
      subscription.unsubscribe();
    }
  }
}