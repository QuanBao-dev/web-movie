import { BehaviorSubject } from "rxjs";
const initialState = {
  query: null,
  isLoading: true,
  maxPage: 1,
  textSearch: "",
  dataAnime: [],
  type: "",
  limit: null,
  searchBy: "anime",
  q: "",
  page: 1,
  score: "",
  min_score: "",
  max_score: "",
  status: "",
  rating: "",
  sfw: null,
  genres: "",
  themes: "",
  explicit_genres: "",
  demographics: "",
  genres_exclude: "",
  sort: "asc",
  letter: "",
  orderBy: "",
  producers: "",
  typeMangaOptionsList: [
    "manga",
    "novel",
    "lightnovel",
    "oneshot",
    "doujin",
    "manhwa",
    "manhua",
  ],
  statusMangaOptionsList: [
    "publishing",
    "complete",
    "hiatus",
    "discontinued",
    "upcoming",
  ],
  orderByMangaOptionsList: [
    "mal_id",
    "title",
    "start_date",
    "end_date",
    "chapters",
    "volumes",
    "score",
    "scored_by",
    "rank",
    "popularity",
    "members",
    "favorites",
  ],
  explicitGenresOptionsList: [
    {
      mal_id: 12,
      name: "Hentai",
    },
    {
      mal_id: 49,
      name: "Erotica",
    },
    {
      mal_id: 9,
      name: "Ecchi",
    },
  ],
  demographicsOptionsList: [
    {
      mal_id: 27,
      name: "Shounen",
    },
    {
      mal_id: 25,
      name: "Shoujo",
    },
    {
      mal_id: 42,
      name: "Seinen",
    },
    {
      mal_id: 15,
      name: "Kids",
    },
    {
      mal_id: 43,
      name: "Josei",
    },
  ],
  typeOptionsList: ["tv", "movie", "ova", "special", "ona", "music"],
  statusOptionsList: ["airing", "complete", "upcoming"],
  ratingOptionsList: [
    "g",
    "pg",
    "pg13",
    "r17",
    { mal_id: "r", name: "r+" },
    "rx",
  ],
  sortOptionsList: ["desc", "asc"],
  orderByCharacterOptionsList: ["mal_id", "name", "favorites"],
  orderByVoiceActorOptionsList: ["mal_id", "name", "favorites", "birthday"],
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
    },
    {
      mal_id: 2,
      name: "Adventure",
    },
    {
      mal_id: 4,
      name: "Comedy",
    },
    {
      mal_id: 5,
      name: "Avant Garde",
    },
    {
      mal_id: 7,
      name: "Mystery",
    },
    {
      mal_id: 8,
      name: "Drama",
    },

    {
      mal_id: 10,
      name: "Fantasy",
    },

    {
      mal_id: 14,
      name: "Horror",
    },

    {
      mal_id: 18,
      name: "Mecha",
    },
    {
      mal_id: 19,
      name: "Music",
    },
    {
      mal_id: 22,
      name: "Romance",
    },
    {
      mal_id: 24,
      name: "Sci-Fi",
    },

    {
      mal_id: 26,
      name: "Girls Love",
    },

    {
      mal_id: 28,
      name: "Boys Love",
    },
    {
      mal_id: 30,
      name: "Sports",
    },
    {
      mal_id: 36,
      name: "Slice of Life",
    },
    {
      mal_id: 37,
      name: "Supernatural",
    },
    {
      mal_id: 38,
      name: "Military",
    },
    {
      mal_id: 39,
      name: "Police",
    },
    {
      mal_id: 40,
      name: "Psychological",
    },
    {
      mal_id: 41,
      name: "Suspense",
    },

    {
      mal_id: 46,
      name: "Award Winning",
    },
    {
      mal_id: 47,
      name: "Gourmet",
    },
  ],
  themesDataOptionsList: [
    {
      mal_id: 50,
      name: "Adult Cast",
    },
    {
      mal_id: 51,
      name: "Anthropomorphic",
    },
    {
      mal_id: 52,
      name: "CGDCT",
    },
    {
      mal_id: 53,
      name: "Childcare",
    },
    {
      mal_id: 54,
      name: "Combat Sports",
    },
    {
      mal_id: 81,
      name: "Crossdressing",
    },
    {
      mal_id: 55,
      name: "Delinquents",
    },
    {
      mal_id: 39,
      name: "Detective",
    },
    {
      mal_id: 56,
      name: "Educational",
    },
    {
      mal_id: 57,
      name: "Gag Humor",
    },
    {
      mal_id: 58,
      name: "Gore",
    },
    {
      mal_id: 35,
      name: "Harem",
    },
    {
      mal_id: 59,
      name: "High Stakes Game",
    },
    {
      mal_id: 13,
      name: "Historical",
    },
    {
      mal_id: 60,
      name: "Idols (Female)",
    },
    {
      mal_id: 61,
      name: "Idols (Male)",
    },
    {
      mal_id: 62,
      name: "Isekai",
    },
    {
      mal_id: 63,
      name: "Iyashikei",
    },
    {
      mal_id: 64,
      name: "Love Polygon",
    },
    {
      mal_id: 65,
      name: "Magical Sex Shift",
    },
    {
      mal_id: 66,
      name: "Mahou Shoujo",
    },
    {
      mal_id: 17,
      name: "Martial Arts",
    },
    {
      mal_id: 18,
      name: "Mecha",
    },
    {
      mal_id: 67,
      name: "Medical",
    },
    {
      mal_id: 38,
      name: "Military",
    },
    {
      mal_id: 19,
      name: "Music",
    },
    {
      mal_id: 6,
      name: "Mythology",
    },
    {
      mal_id: 68,
      name: "Organized Crime",
    },
    {
      mal_id: 69,
      name: "Otaku Culture",
    },
    {
      mal_id: 20,
      name: "Parody",
    },
    {
      mal_id: 70,
      name: "Performing Arts",
    },
    {
      mal_id: 71,
      name: "Pets",
    },
    {
      mal_id: 40,
      name: "Psychological",
    },
    {
      mal_id: 3,
      name: "Racing",
    },
    {
      mal_id: 72,
      name: "Reincarnation",
    },
    {
      mal_id: 73,
      name: "Reverse Harem",
    },
    {
      mal_id: 74,
      name: "Romantic Subtext",
    },
    {
      mal_id: 21,
      name: "Samurai",
    },
    {
      mal_id: 23,
      name: "School",
    },
    {
      mal_id: 75,
      name: "Showbiz",
    },
    {
      mal_id: 29,
      name: "Space",
    },
    {
      mal_id: 11,
      name: "Strategy Game",
    },
    {
      mal_id: 31,
      name: "Super Power",
    },
    {
      mal_id: 76,
      name: "Survival",
    },
    {
      mal_id: 77,
      name: "Team Sports",
    },
    {
      mal_id: 78,
      name: "Time Travel",
    },
    {
      mal_id: 32,
      name: "Vampire",
    },
    {
      mal_id: 79,
      name: "Video Game",
    },
    {
      mal_id: 80,
      name: "Visual Arts",
    },
    {
      mal_id: 48,
      name: "Workplace",
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
