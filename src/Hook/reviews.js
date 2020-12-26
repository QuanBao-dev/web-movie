import { useEffect } from "react";
import {
  initReviewState,
  resetReviewsState,
  updatePageScrolling,
  fetchReviewsData,
} from "../Functions/reviews";
export const useInitReviewsState = (setReviewState) => {
  useEffect(initReviewState(setReviewState), []);
};

export const useResetReviewsState = (malId, { previousMalId }) => {
  useEffect(resetReviewsState(malId), [malId, previousMalId]);
};

export const useUpdatePageScrolling = ({
  pageReviewsData,
  shouldUpdatePageReviewData,
}) => {
  useEffect(updatePageScrolling(shouldUpdatePageReviewData), [
    pageReviewsData,
    shouldUpdatePageReviewData,
  ]);
};

export const useFetchReviewsData = (
  { pageReviewsData, reviewsData },
  malId
) => {
  useEffect(fetchReviewsData(pageReviewsData, reviewsData, malId), [
    malId,
    pageReviewsData,
  ]);
};
