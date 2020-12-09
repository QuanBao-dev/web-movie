import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import {
  changeSearchInput$,
  listenSearchInputPressEnter$,
  searchToolStream,
} from "../../epics/searchTool";
import Input from "../Input/Input";
const SearchInput = ({ textSearch }) => {
  const history = useHistory();
  const searchInput = useRef(null);
  useEffect(() => {
    const subscription6 = changeSearchInput$(searchInput.current).subscribe(
      (v) => {
        searchToolStream.updateData({ dataSearch: v });
      }
    );
    const subscription10 = listenSearchInputPressEnter$(
      searchInput.current
    ).subscribe((v) => {
      history.push("/anime/search?key=" + v);
    });
    return () => {
      unsubscribeSubscription(subscription6, subscription10);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textSearch]);
  return (
    <div style={{ width: "90%", margin: "auto" }}>
      <Input label="Search Anime" input={searchInput} />
    </div>
  );
};
export default SearchInput;

function unsubscribeSubscription(...subscriptions) {
  subscriptions.forEach((subscription) => {
    subscription.unsubscribe();
  });
}
