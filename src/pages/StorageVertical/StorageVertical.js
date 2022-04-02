/* eslint-disable no-useless-escape */
import loadable from "@loadable/component";
import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
const LazyLoadAnimeList = loadable(
  () => import("../../components/LazyLoadAnimeList/LazyLoadAnimeList"),
  {
    fallback: <CircularProgress color="primary" size="7rem" />,
  }
);

const StorageVertical = (props) => {
  const query = props.location.search;
  const {
    q,
    genres,
    genres_exclude,
    letter,
    max_score,
    min_score,
    orderBy,
    producers,
    rating,
    sfw,
    sort,
    status,
    type,
  } = {
    q: query.match(/q=[a-zA-Z0-9 \~\!\@\#\$\%\^\*\(\)\_\-\+\=\`\\\.]+/g)
      ? query
          .match(/q=[a-zA-Z0-9 \~\!\@\#\$\%\^\*\(\)\_\-\+\=\`\\\.]+/g)[0]
          .replace("q=", "")
          .replace(/%20/g, " ")
      : "",
    page: query.match(/page=[0-9]+/g)
      ? parseInt(query.match(/page=[0-9]+/g)[0].replace("page=", ""))
      : 1,
    min_score: query.match(/min_score=[0-9]+/g)
      ? parseInt(query.match(/min_score=[0-9]+/g)[0].replace("min_score=", ""))
      : "",
    max_score: query.match(/max_score=[0-9]+/g)
      ? parseInt(query.match(/max_score=[0-9]+/g)[0].replace("max_score=", ""))
      : "",
    sfw: query.match(/sfw/g) ? query.match(/sfw/g)[0] : "",
    rating: query.match(/rating=[a-zA-Z]+/g)
      ? query.match(/rating=[a-zA-Z]+/g)[0].replace("rating=", "")
      : "",
    status: query.match(/status=[a-zA-Z]+/g)
      ? query.match(/status=[a-zA-Z]+/g)[0].replace("status=", "")
      : "",
    sort: query.match(/sort=[a-zA-Z]+/g)
      ? query.match(/sort=[a-zA-Z]+/g)[0].replace("sort=", "")
      : "desc",
    orderBy: query.match(/order_by=[a-zA-Z_]+/g)
      ? query.match(/order_by=[a-zA-Z_]+/g)[0].replace("order_by=", "")
      : "",
    type: query.match(/type=[a-zA-Z]+/g)
      ? query.match(/type=[a-zA-Z]+/g)[0].replace("type=", "")
      : "",
    genres: query.match(/genres=[0-9,]+/g)
      ? query.match(/genres=[0-9,]+/g)[0].replace("genres=", "")
      : "",
    themes: query.match(/genres=[0-9,]+/g)
      ? query.match(/genres=[0-9,]+/g)[0].replace("genres=", "")
      : "",
    genres_exclude: query.match(/genres_exclude=[0-9,]+/g)
      ? query.match(/genres_exclude=[0-9,]+/g)[0].replace("genres_exclude=", "")
      : "",
    producers: query.match(/producers=[0-9,]+/g)
      ? query.match(/producers=[0-9,]+/g)[0].replace("producers=", "")
      : "",
    letter: query.match(
      /letter=[a-zA-Z0-9 \~\!\@\#\$\%\^\*\(\)\_\-\+\=\`\\\.]+/g
    )
      ? query
          .match(/letter=[a-zA-Z0-9 \~\!\@\#\$\%\^\*\(\)\_\-\+\=\`\\\.]+/g)[0]
          .replace("letter=", "")
          .replace(/%20/g, " ")
      : "",
  };
  // console.log(dataQuery);
  return (
    <LazyLoadAnimeList
      url={`https://api.jikan.moe/v4/anime?page={page}${q ? `&q=${q}` : ""}${
        type ? `&type=${type}` : ""
      }${rating ? `&rating=${rating}` : ""}${
        status ? `&status=${status}` : ""
      }${orderBy ? `&order_by=${orderBy}` : ""}${
        orderBy && sort ? `&sort=${sort}` : ""
      }${max_score ? `&max_score=${max_score}` : ""}${
        min_score ? `&min_score=${min_score}` : ""
      }${sfw === "sfw" ? `&sfw` : ""}${genres ? `&genres=${genres}` : ""}${
        genres_exclude ? `&genres_exclude=${genres_exclude}` : ""
      }${producers ? `&producers=${producers}` : ""}${
        letter ? `&letter=${letter}` : ""
      }`}
      query={query}
      title={"Filter"}
    />
  );
};

export default StorageVertical;
