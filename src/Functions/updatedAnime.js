import { updatedAnimeStream } from "../epics/updatedAnime";

export const initUpdatedAnime = (setUpdatedAnime) => {
  return () => {
    const subscription = updatedAnimeStream.subscribe(setUpdatedAnime);
    updatedAnimeStream.init();
    return () => {
      subscription.unsubscribe();
    };
  };
};
