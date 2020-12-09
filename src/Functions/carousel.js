import { interval } from "rxjs";
import { carouselStream, fetchCarousel$ } from "../epics/carousel";
export const initCarousel = (setCarousel) => {
  return () => {
    const subscription = carouselStream.subscribe(setCarousel);
    carouselStream.init();
    return () => {
      subscription.unsubscribe();
    };
  };
};

export const fetchCarousel = () => {
  return () => {
    const subscription = fetchCarousel$().subscribe((v) => {
      if (!v.error) carouselStream.updateData({ dataCarousel: v });
    });
    return () => {
      subscription.unsubscribe();
    };
  };
};

export const autoSlidingNextPage = (pageCarousel, setPageCarousel) => {
  return () => {
    const intervalSub = interval(3000).subscribe(() => {
      const page = pageCarousel;
      document.querySelector(".section-carousel-container").style.transition =
        "0.4s";
      setPageCarousel(page + 1);
    });
    return () => {
      intervalSub.unsubscribe();
    };
  };
};
