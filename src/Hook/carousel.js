import { useEffect } from "react";
import {
  autoSlidingNextPage,
  fetchCarousel,
  initCarousel,
} from "../Functions/carousel";

export const useInitCarousel = (setCarouselState) => {
  useEffect(initCarousel(setCarouselState), []);
};

export const useFetchCarousel = () => {
  useEffect(fetchCarousel(), []);
};

export const useAutoSlidingNextPage = (pageCarousel, setPageCarousel) => {
  useEffect(autoSlidingNextPage(pageCarousel, setPageCarousel), [pageCarousel]);
};
