import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { changeSearchInput$, listenSearchInputPressEnter$, stream } from "../../epics/home";
import Input from "../Input/Input";
const SearchInput = () => {
  const history = useHistory();
  const searchInput = useRef(null);
  const [homeState, setHomeState] = useState(
    stream.currentState() ? stream.currentState() : stream.initialState
  );
  useEffect(() => {
    const subscription = stream.subscribe(setHomeState);
    window.scroll({ top: 0 });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    const subscription6 = changeSearchInput$(searchInput.current).subscribe();
    const subscription10 = listenSearchInputPressEnter$(
      searchInput.current
    ).subscribe((v) => {
      history.push("/anime/search?key=" + v);
    });
    return () => {
      unsubscribeSubscription(subscription6, subscription10);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeState.textSearch]);
  return (
    <div style={{ width: "90%" }}>
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
