export const SITE = {
  name: "Bush Turkey Track Club",
  shortName: "Bush Turkey",
  description:
    "The Bush Turkey Track Club is an amateur performance-focused distance running team based in Brisbane, Australia. We also host entertaining and competitive races throughout the year. Join us for a run!",
  locale: "en_AU",
  timeZone: "Australia/Brisbane",
  gaId: "G-XC22TYE3ZG",
};

export const LINKS = {
  instagram: "https://www.instagram.com/bush_turkey_track_club/",
  strava: "https://www.strava.com/clubs/996569",
  store: "https://www.revolutionise.com.au/bushturkeytc/shop",
};

export const NAV = [
  { href: "/events/", label: "Events" },
  { href: "/about/", label: "About" },
  { href: "/records/", label: "Records" },
  { href: "/running-calculator/", label: "Calculator" },
  { href: LINKS.store, label: "Store", external: true },
];

/**
 * Event series. The key is used in each event's `series` field; editions of
 * the same series are linked automatically on the event page.
 */
export const SERIES = {
  "bush-turkey-classic": { label: "Bush Turkey Classic" },
  "bush-turkey-relay": { label: "Bush Turkey Relay" },
  "nudgee-gift": { label: "Nudgee Gift" },
  "turkey-smash": { label: "Turkey Smash" },
  "bush-turkey-5000": { label: "Bush Turkey 5000m" },
  "speed-week": { label: "Speed Week" },
  "club-racing": { label: "Club racing" },
} as const;

export type SeriesKey = keyof typeof SERIES;
export const SERIES_KEYS = Object.keys(SERIES) as [SeriesKey, ...SeriesKey[]];
