import { BehaviorSubject } from "rxjs";
const initialState = {
  textSearch: "",
  dataAnime: [],
  type: "",
  limit: null,
  q:"",
  page: 1,
  score: "",
  min_score: "",
  max_score: "",
  status: "",
  rating: "", 
  sfw: null,
  genres: "",
  genres_exclude:"",
  sort: "asc",
  letter: "",
  orderBy:"",
  producers: "",
  typeOptionsList: ["tv", "movie", "ova", "special", "ona", "music"],
  statusOptionsList: ["airing", "complete", "upcoming"],
  ratingOptionsList: ["g", "pg", "pg13", "r17", "r", "rx"],
  sortOptionsList: ["desc","asc"],
  orderByOptionsList: [
    "mal_id",
    "title",
    "type",
    "rating",
    "start_date",
    "end_date",
    "episodes",
    "score",
    "scored_by",
    "rank",
    "popularity",
    "members",
    "favorites",
  ],
  genresDataOptionsList: [
    {
      mal_id: 1,
      name: "Action",
      url: "https://myanimelist.net/anime/genre/1/Action",
      count: 4150,
    },
    {
      mal_id: 2,
      name: "Adventure",
      url: "https://myanimelist.net/anime/genre/2/Adventure",
      count: 3185,
    },
    {
      mal_id: 3,
      name: "Cars",
      url: "https://myanimelist.net/anime/genre/3/Cars",
      count: 146,
    },
    {
      mal_id: 4,
      name: "Comedy",
      url: "https://myanimelist.net/anime/genre/4/Comedy",
      count: 6450,
    },
    {
      mal_id: 5,
      name: "Avant Garde",
      url: "https://myanimelist.net/anime/genre/5/Avant_Garde",
      count: 569,
    },
    {
      mal_id: 6,
      name: "Demons",
      url: "https://myanimelist.net/anime/genre/6/Demons",
      count: 546,
    },
    {
      mal_id: 7,
      name: "Mystery",
      url: "https://myanimelist.net/anime/genre/7/Mystery",
      count: 771,
    },
    {
      mal_id: 8,
      name: "Drama",
      url: "https://myanimelist.net/anime/genre/8/Drama",
      count: 2744,
    },
    {
      mal_id: 9,
      name: "Ecchi",
      url: "https://myanimelist.net/anime/genre/9/Ecchi",
      count: 771,
    },
    {
      mal_id: 10,
      name: "Fantasy",
      url: "https://myanimelist.net/anime/genre/10/Fantasy",
      count: 3643,
    },
    {
      mal_id: 11,
      name: "Game",
      url: "https://myanimelist.net/anime/genre/11/Game",
      count: 426,
    },
    {
      mal_id: 12,
      name: "Hentai",
      url: "https://myanimelist.net/anime/genre/12/Hentai",
      count: 1401,
    },
    {
      mal_id: 13,
      name: "Historical",
      url: "https://myanimelist.net/anime/genre/13/Historical",
      count: 1257,
    },
    {
      mal_id: 14,
      name: "Horror",
      url: "https://myanimelist.net/anime/genre/14/Horror",
      count: 475,
    },
    {
      mal_id: 15,
      name: "Kids",
      url: "https://myanimelist.net/anime/genre/15/Kids",
      count: 3514,
    },
    {
      mal_id: 17,
      name: "Martial Arts",
      url: "https://myanimelist.net/anime/genre/17/Martial_Arts",
      count: 495,
    },
    {
      mal_id: 18,
      name: "Mecha",
      url: "https://myanimelist.net/anime/genre/18/Mecha",
      count: 1144,
    },
    {
      mal_id: 19,
      name: "Music",
      url: "https://myanimelist.net/anime/genre/19/Music",
      count: 2544,
    },
    {
      mal_id: 20,
      name: "Parody",
      url: "https://myanimelist.net/anime/genre/20/Parody",
      count: 678,
    },
    {
      mal_id: 21,
      name: "Samurai",
      url: "https://myanimelist.net/anime/genre/21/Samurai",
      count: 207,
    },
    {
      mal_id: 22,
      name: "Romance",
      url: "https://myanimelist.net/anime/genre/22/Romance",
      count: 2004,
    },
    {
      mal_id: 23,
      name: "School",
      url: "https://myanimelist.net/anime/genre/23/School",
      count: 1726,
    },
    {
      mal_id: 24,
      name: "Sci-Fi",
      url: "https://myanimelist.net/anime/genre/24/Sci-Fi",
      count: 2705,
    },
    {
      mal_id: 25,
      name: "Shoujo",
      url: "https://myanimelist.net/anime/genre/25/Shoujo",
      count: 699,
    },
    {
      mal_id: 26,
      name: "Girls Love",
      url: "https://myanimelist.net/anime/genre/26/Girls_Love",
      count: 115,
    },
    {
      mal_id: 27,
      name: "Shounen",
      url: "https://myanimelist.net/anime/genre/27/Shounen",
      count: 2007,
    },
    {
      mal_id: 28,
      name: "Boys Love",
      url: "https://myanimelist.net/anime/genre/28/Boys_Love",
      count: 152,
    },
    {
      mal_id: 29,
      name: "Space",
      url: "https://myanimelist.net/anime/genre/29/Space",
      count: 511,
    },
    {
      mal_id: 30,
      name: "Sports",
      url: "https://myanimelist.net/anime/genre/30/Sports",
      count: 756,
    },
    {
      mal_id: 31,
      name: "Super Power",
      url: "https://myanimelist.net/anime/genre/31/Super_Power",
      count: 652,
    },
    {
      mal_id: 32,
      name: "Vampire",
      url: "https://myanimelist.net/anime/genre/32/Vampire",
      count: 145,
    },
    {
      mal_id: 35,
      name: "Harem",
      url: "https://myanimelist.net/anime/genre/35/Harem",
      count: 419,
    },
    {
      mal_id: 36,
      name: "Slice of Life",
      url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
      count: 2095,
    },
    {
      mal_id: 37,
      name: "Supernatural",
      url: "https://myanimelist.net/anime/genre/37/Supernatural",
      count: 1575,
    },
    {
      mal_id: 38,
      name: "Military",
      url: "https://myanimelist.net/anime/genre/38/Military",
      count: 604,
    },
    {
      mal_id: 39,
      name: "Police",
      url: "https://myanimelist.net/anime/genre/39/Police",
      count: 255,
    },
    {
      mal_id: 40,
      name: "Psychological",
      url: "https://myanimelist.net/anime/genre/40/Psychological",
      count: 381,
    },
    {
      mal_id: 41,
      name: "Suspense",
      url: "https://myanimelist.net/anime/genre/41/Suspense",
      count: 149,
    },
    {
      mal_id: 42,
      name: "Seinen",
      url: "https://myanimelist.net/anime/genre/42/Seinen",
      count: 883,
    },
    {
      mal_id: 43,
      name: "Josei",
      url: "https://myanimelist.net/anime/genre/43/Josei",
      count: 99,
    },
    {
      mal_id: 46,
      name: "Award Winning",
      url: "https://myanimelist.net/anime/genre/46/Award_Winning",
      count: 7,
    },
    {
      mal_id: 47,
      name: "Gourmet",
      url: "https://myanimelist.net/anime/genre/47/Gourmet",
      count: 106,
    },
    {
      mal_id: 48,
      name: "Work Life",
      url: "https://myanimelist.net/anime/genre/48/Work_Life",
      count: 8,
    },
    {
      mal_id: 49,
      name: "Erotica",
      url: "https://myanimelist.net/anime/genre/49/Erotica",
      count: 87,
    },
  ],
};
const behaviorSubject = new BehaviorSubject(initialState);

let state = initialState;

const storageAnimeStore = {
  initialState,
  subscribe: (setState) => behaviorSubject.subscribe((v) => setState(v)),
  currentState: () => {
    let ans;
    behaviorSubject.subscribe((v) => {
      ans = v;
    });
    return ans || initialState;
  },
  init: () => {
    behaviorSubject.next(state);
  },
  updateData: (data = initialState) => {
    state = {
      ...state,
      ...data,
    };
    behaviorSubject.next(state);
  },
  updateDataQuick: (data = initialState) => {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      state[key] = data[key];
    });
  },
};

export default storageAnimeStore;
