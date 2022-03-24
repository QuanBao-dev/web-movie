import "./CustomSelect2.css";

import React, { useEffect, useRef, useState } from "react";
import { fromEvent, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { catchError, debounceTime, filter, pluck } from "rxjs/operators";

const CustomSelect2 = ({
  url,
  dataOptions,
  valueRef,
  label,
  triggerReset,
  defaultValue,
}) => {
  const customSelectContainerRef = useRef();
  const listSuggestionRef = useRef();
  const isDoneFetchingRef = useRef(false);
  const inputRef = useRef();
  const [allSelectedOptions, setAllSelectedOptions] = useState([]);
  const [maxPage, setMaxPage] = useState([]);
  const [page, setPage] = useState(1);
  const [dataSuggestions, setDataSuggestions] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [triggerFetch, setTriggerFetch] = useState(0);
  const pageRef = useRef();
  const textSearchRef = useRef();
  useEffect(() => {
    valueRef.current = defaultValue;
    setAllSelectedOptions(defaultValue);
    inputRef.current.value = "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerReset]);

  useEffect(() => {
    if (!defaultValue) return;
    setAllSelectedOptions(defaultValue);
  }, [defaultValue]);
  useEffect(() => {
    if (!url) {
      setActiveIndex(0);
      setDataSuggestions(
        dataOptions.filter((data) =>
          data.name.match(new RegExp(textSearch, "i"))
        )
      );
      return;
    }
    isDoneFetchingRef.current = false;
    const subscription = ajax(
      url + `?page=${page}` + (textSearch !== "" ? `&q=${textSearch}` : "")
    )
      .pipe(
        pluck("response"),
        catchError((error) => of({ error }))
      )
      .subscribe((data) => {
        isDoneFetchingRef.current = true;
        if (data.error) return;
        setMaxPage(data.pagination.last_visible_page);
        if (textSearchRef.current !== textSearch) {
          setDataSuggestions([...data.data]);
          setPage(1);
          setActiveIndex(0);
        }
        if (pageRef.current !== page) {
          setDataSuggestions([...dataSuggestions, ...data.data]);
        }
        if(textSearchRef.current === textSearch && pageRef.current === page){
          setDataSuggestions([...data.data]);
          setPage(1);
          setActiveIndex(0);
        }
        pageRef.current = page;
        textSearchRef.current = textSearch;
      });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textSearch, page, url, triggerFetch]);

  useEffect(() => {
    if (!url) return;
    const subscription = fromEvent(listSuggestionRef.current, "scroll")
      .pipe(
        filter(
          () =>
            listSuggestionRef.current.scrollHeight -
              listSuggestionRef.current.scrollTop <=
              200 && isDoneFetchingRef.current === true
        ),
        debounceTime(300)
      )
      .subscribe(() => {
        if (maxPage >= page + 1) setPage(page + 1);
      });
    return () => {
      subscription.unsubscribe();
    };
  }, [maxPage, page, url]);

  useEffect(() => {
    const subscription = fromEvent(inputRef.current, "focus").subscribe(() => {
      listSuggestionRef.current.style.display = "block";
      setTriggerFetch(!triggerFetch);
    });

    const subscription2 = fromEvent(window, "click").subscribe((e) => {
      if (customSelectContainerRef.current.contains(e.target)) return;
      listSuggestionRef.current.scroll({
        top: 0,
      });
      listSuggestionRef.current.style.display = "none";
    });

    const subscription3 = fromEvent(inputRef.current, "input")
      .pipe(debounceTime(500))
      .subscribe((e) => {
        listSuggestionRef.current.style.display = "block";
        setTextSearch(e.target.value);
      });
    return () => {
      subscription.unsubscribe();
      subscription2.unsubscribe();
      subscription3.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  valueRef.current = allSelectedOptions;
  return (
    <fieldset
      className="custom-select2-container"
      ref={customSelectContainerRef}
    >
      <legend className="label-select2">{label}</legend>
      <div className="custom-select2-wrapper">
        <div
          className="input-section-container"
          onClick={() => {
            inputRef.current.focus();
          }}
        >
          {allSelectedOptions.length > 0 && (
            <div
              className="all-options-selected"
              onClick={() => {
                inputRef.current.focus();
              }}
            >
              {allSelectedOptions.map((data, index) => (
                <span
                  key={index}
                  onClick={() => {
                    setAllSelectedOptions(
                      allSelectedOptions.filter(
                        ({ mal_id }) => mal_id !== data.mal_id
                      )
                    );
                  }}
                >
                  <div className="one"></div>
                  <div className="two"></div>
                  {data.name}
                </span>
              ))}
            </div>
          )}
          <input
            placeholder="Click to add tags"
            ref={inputRef}
            onKeyDown={(e) => {
              listSuggestionRef.current.style.display = "block";

              if (e.key === "Escape") {
                e.preventDefault();
                listSuggestionRef.current.scroll({
                  top: 0,
                });
                listSuggestionRef.current.style.display = "none";
                setActiveIndex(0);
              }

              if (e.key === "ArrowUp") {
                e.preventDefault();
                if (activeIndex > 0) setActiveIndex(activeIndex - 1);
                const startIndex = Math.round(
                  listSuggestionRef.current.scrollTop / 35.2
                );

                if (activeIndex <= startIndex) {
                  listSuggestionRef.current.scroll({
                    top: (activeIndex - 1) * 35.2,
                  });
                }
              }

              if (e.key === "ArrowDown") {
                e.preventDefault();
                // if (activeIndex === null) setActiveIndex(0);
                if (activeIndex < dataSuggestions.length - 1)
                  setActiveIndex(activeIndex + 1);
                const startIndex = Math.round(
                  listSuggestionRef.current.scrollTop / 35.2
                );
                const endIndex = startIndex + 3;
                if (activeIndex > endIndex) {
                  listSuggestionRef.current.scroll({
                    top: (activeIndex - 3) * 35.2,
                  });
                }
              }

              if (e.key === "Enter") {
                inputRef.current.value = "";
                listSuggestionRef.current.style.display = "none";
                if (!listSuggestionRef.current.children[activeIndex]) return;
                if (
                  listSuggestionRef.current.children[activeIndex].className !==
                  "active"
                )
                  setAllSelectedOptions([
                    ...allSelectedOptions,
                    { ...dataSuggestions[activeIndex] },
                  ]);
                else
                  setAllSelectedOptions(
                    allSelectedOptions.filter(
                      ({ mal_id }) =>
                        mal_id !== dataSuggestions[activeIndex].mal_id
                    )
                  );
              }

              if (
                e.key === "Backspace" &&
                inputRef.current.value === "" &&
                allSelectedOptions.length > 0
              ) {
                inputRef.current.value =
                  allSelectedOptions[allSelectedOptions.length - 1].name + " ";
                setAllSelectedOptions(
                  allSelectedOptions.slice(0, allSelectedOptions.length - 1)
                );
              }
            }}
          />
        </div>
        <ul className="list-suggestion" ref={listSuggestionRef}>
          {dataSuggestions.map((data, index) => (
            <li
              style={{
                backgroundColor:
                  activeIndex === index ? "rgb(110, 110, 110)" : null,
              }}
              className={
                checkIfActiveItem(allSelectedOptions, data.mal_id)
                  ? "active"
                  : ""
              }
              onClick={(e) => {
                inputRef.current.focus();
                inputRef.current.value = "";
                listSuggestionRef.current.style.display = "none";
                if (e.target.className !== "active")
                  setAllSelectedOptions([...allSelectedOptions, { ...data }]);
                else
                  setAllSelectedOptions(
                    allSelectedOptions.filter(
                      ({ mal_id }) => mal_id !== data.mal_id
                    )
                  );
              }}
              key={index}
            >
              {data.name}
            </li>
          ))}
        </ul>
      </div>
    </fieldset>
  );
};

function checkIfActiveItem(allSelectedItemList, mal_id) {
  return allSelectedItemList.map((data) => data.mal_id).includes(mal_id);
}

export default CustomSelect2;
