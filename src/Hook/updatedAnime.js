import { useEffect } from "react";
import {
  fetchBoxMovie$,
  fetchUpdatedMovie$,
  updatedAnimeStream,
} from "../epics/updatedAnime";
import { initUpdatedAnime } from "../Functions/updatedAnime";
import navBarStore from "../store/navbar";

export const useInitUpdatedAnime = (setUpdatedAnime) => {
  useEffect(initUpdatedAnime(setUpdatedAnime), []);
};

export const useFetchAnimeList = (
  updatedAnimeState,
  subNavToggle,
  setIsEmpty,
  cookies
) => {
  useEffect(() => {
    let subscription8, subscription9;
    if (subNavToggle === 0) {
      setIsEmpty(true);
      subscription8 = fetchUpdatedMovie$().subscribe(({ data, lastPage }) => {
        updatedAnimeStream.updateData({
          updatedMovie: data,
          lastPageUpdatedMovie: lastPage,
        });
        setIsEmpty(false);
        navBarStore.updateIsShowBlockPopUp(false);
      });
    }
    if (subNavToggle === 1) {
      setIsEmpty(true);
      subscription9 = fetchBoxMovie$(cookies.idCartoonUser).subscribe(
        ({ data, lastPage }) => {
          updatedAnimeStream.updateData({
            boxMovie: data,
            lastPageBoxMovie: lastPage,
          });
          setIsEmpty(false);
          navBarStore.updateIsShowBlockPopUp(false);
        }
      );
    }
    return () => {
      subscription8 && subscription8.unsubscribe();
      subscription9 && subscription9.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    subNavToggle,
    updatedAnimeState.currentPageBoxMovie,
    updatedAnimeState.currentPageUpdatedMovie,
    updatedAnimeState.triggerFetch,
  ]);
};
