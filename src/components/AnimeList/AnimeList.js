import "./AnimeList.css";

import loadable from "@loadable/component";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useEffect, useRef } from "react";
import { fromEvent, iif } from "rxjs";

import {
  calculateRowStartEnd,
  lazyLoadAnimeListStream,
} from "../../epics/lazyLoadAnimeList";
import { debounceTime, takeWhile } from "rxjs/operators";
import { mobileAndTabletCheck } from "../../util/checkMobileDevice";
const responsiveObject = [
  {
    maxWidth: 100000,
    minWidth: 1000,
    quantityItemPerRow: 5,
  },
  {
    maxWidth: 1000,
    minWidth: 600,
    quantityItemPerRow: 4,
  },
  {
    maxWidth: 600,
    minWidth: 400,
    quantityItemPerRow: 3,
  },
  {
    maxWidth: 400,
    minWidth: 0,
    quantityItemPerRow: 2,
  },
];
const AnimeItem = loadable(() => import("../AnimeItem/AnimeItem"));
const AnimeList = ({
  data,
  error,
  isWrap = true,
  lazy = false,
  empty = false,
  virtual = false,
  isAllowDelete = false,
}) => {
  const animeListRef = useRef();
  const lazyLoadState = lazyLoadAnimeListStream.currentState();
  useEffect(() => {
    const subscription = iif(
      () => mobileAndTabletCheck(),
      fromEvent(window, "scroll").pipe(takeWhile(() => virtual)),
      fromEvent(window, "scroll").pipe(
        takeWhile(() => virtual),
        debounceTime(300)
      )
    ).subscribe(() => {
      const { rowStart, rowEnd } = calculateRowStartEnd(
        animeListRef,
        lazyLoadState.heightItem
      );
      if (
        rowStart !== lazyLoadState.rowStart &&
        rowEnd !== lazyLoadState.rowEnd
      ) {
        lazyLoadAnimeListStream.updateData({
          rowStart,
          rowEnd,
        });
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [
    lazyLoadState.heightItem,
    lazyLoadState.rowEnd,
    lazyLoadState.rowStart,
    virtual,
  ]);
  useEffect(() => {
    handleResponsiveWidth(animeListRef, lazyLoadState);
    const subscription = fromEvent(window, "resize")
      .pipe(debounceTime(500))
      .subscribe(() => {
        handleResponsiveWidth(animeListRef, lazyLoadState);
      });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazyLoadState.heightItem, lazyLoadState.rowEnd, lazyLoadState.rowStart]);
  useEffect(() => {
    if (!virtual) return;
    const widthItem =
      animeListRef.current.offsetWidth / lazyLoadState.quantityItemPerRow;
    const heightItem = (widthItem * 340) / 224;
    const height =
      Math.ceil(
        lazyLoadState.genreDetailData.length / lazyLoadState.quantityItemPerRow
      ) * heightItem;
    const { rowStart, rowEnd } = calculateRowStartEnd(animeListRef, heightItem);
    lazyLoadAnimeListStream.updateData({
      width: animeListRef.current.offsetWidth,
      height,
      widthItem,
      heightItem,
      rowStart: rowStart,
      rowEnd: rowEnd,
    });
  }, [
    lazyLoadState.heightItem,
    lazyLoadState.quantityItemPerRow,
    lazyLoadState.genreDetailData.length,
    lazyLoadState.trigger,
    virtual,
  ]);

  return (
    <div
      ref={animeListRef}
      className={isWrap ? "list-anime" : "list-anime-nowrap"}
      style={{
        position: virtual ? "relative" : "static",
        height: lazyLoadState.height,
        width: lazyLoadState.widthContainerList
          ? lazyLoadState.widthContainerList
          : 280,
      }}
    >
      {data &&
        !virtual &&
        !error &&
        data.map((anime, index) => {
          return (
            <AnimeItem
              key={index}
              anime={anime}
              lazy={lazy}
              virtual={false}
              isAllowDelete={isAllowDelete}
            />
          );
        })}
      {data &&
        virtual &&
        !error &&
        data
          .slice(
            (lazyLoadState.rowStart - 1) * lazyLoadState.quantityItemPerRow,
            (lazyLoadState.rowEnd - 1) * lazyLoadState.quantityItemPerRow
          )
          .map((anime, index) => {
            return (
              <div
                key={
                  (lazyLoadState.rowStart - 1) *
                    lazyLoadState.quantityItemPerRow +
                  index
                }
                style={
                  virtual
                    ? {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: lazyLoadState.heightItem,
                        width: lazyLoadState.widthItem,
                        position: "absolute",
                        top:
                          parseInt(
                            ((lazyLoadState.rowStart - 1) *
                              lazyLoadState.quantityItemPerRow +
                              index) /
                              lazyLoadState.quantityItemPerRow
                          ) * lazyLoadState.heightItem,
                        left:
                          parseInt(
                            ((lazyLoadState.rowStart - 1) *
                              lazyLoadState.quantityItemPerRow +
                              index) %
                              lazyLoadState.quantityItemPerRow
                          ) * lazyLoadState.widthItem,
                      }
                    : {}
                }
              >
                <AnimeItem
                  anime={anime}
                  lazy={lazy}
                  virtual={true}
                  isAllowDelete={isAllowDelete}
                  styleAnimeItem={{ width: "90%", height: "95%" }}
                />
              </div>
            );
          })}
      {data && data.length === 0 && empty && (
        <div className="empty">
          <CircularProgress color="secondary" size="4rem" />
        </div>
      )}
      {error && (
        <div
          style={{
            margin: "100px auto 0 auto",
            color: "white",
            fontSize: "150%",
          }}
        >
          Anime is being updated...
        </div>
      )}
    </div>
  );
};

function handleResponsiveWidth(animeListRef, lazyLoadState) {
  const { rowStart, rowEnd } = calculateRowStartEnd(
    animeListRef,
    lazyLoadState.heightItem
  );
  for (let i = 0; i < responsiveObject.length; i++) {
    const { maxWidth, minWidth, quantityItemPerRow } = responsiveObject[i];
    if (window.innerWidth < maxWidth && window.innerWidth > minWidth) {
      lazyLoadAnimeListStream.updateData({
        quantityItemPerRow,
      });
      break;
    }
  }
  if (rowStart !== lazyLoadState.rowStart && rowEnd !== lazyLoadState.rowEnd) {
    lazyLoadAnimeListStream.updateData({
      rowStart,
      rowEnd,
    });
  }
  lazyLoadAnimeListStream.updateData({
    trigger: !lazyLoadAnimeListStream.currentState().trigger,
  });
}

export default AnimeList;
