import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { parse as parseYaml } from "yaml";
import { SERIES_KEYS } from "./consts";

/** A course, map or updates link shown as a button. */
const link = z.object({ label: z.string(), url: z.url() });

/**
 * Where an event's results come from. Exactly one of:
 * - chiron: embed live results from events.chironapp.com
 * - data:   CSV files stored next to the event's index.md
 * - link:   results hosted somewhere else
 */
const results = z.discriminatedUnion("source", [
  z.object({
    source: z.literal("chiron"),
    type: z.enum(["series", "event"]),
    id: z.uuid(),
    /** Optional sub-page of a Chiron event, e.g. "teams". */
    view: z.string().optional(),
    /** Optional CSV snapshot of final results (relative to the event folder). */
    archive: z.string().optional(),
  }),
  z.object({
    source: z.literal("data"),
    tables: z
      .array(
        z.object({
          title: z.string(),
          /** CSV path relative to the event folder, e.g. results/round-1.csv */
          file: z.string(),
          note: z.string().optional(),
          /** Columns to offer as dropdown filters. */
          filters: z.array(z.string()).optional(),
        }),
      )
      .min(1),
  }),
  z.object({
    source: z.literal("link"),
    url: z.url(),
    label: z.string().default("Results"),
  }),
]);

const events = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "./src/content/events" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        series: z.enum(SERIES_KEYS),
        /** Race day, or the first round of a series. */
        date: z.coerce.date(),
        /** Last round of a multi-round series. */
        endDate: z.coerce.date().optional(),
        /** Show only the month and year, when the exact day isn't known. */
        monthOnly: z.boolean().default(false),
        /** Start time for single-day events, e.g. "5:00 PM". */
        time: z.string().optional(),
        location: z.object({ name: z.string(), mapUrl: z.url().optional() }).optional(),
        /** One or two sentences for event cards and search/social previews. */
        summary: z.string(),
        /** Optional: events without a photo get a club-branded card. */
        hero: image().optional(),
        heroAlt: z.string().optional(),
        /** "contain" shows the whole image on cards (for logos/posters that crop badly). */
        heroFit: z.enum(["cover", "contain"]).default("cover"),
        links: z.array(link).default([]),
        registerUrl: z.url().optional(),
        photosUrl: z.url().optional(),
        rounds: z
          .array(
            z.object({
              name: z.string(),
              date: z.coerce.date(),
              time: z.string().optional(),
              description: z.string(),
              meet: z
                .object({ time: z.string().optional(), place: z.string(), mapUrl: z.url().optional() })
                .optional(),
              image: image().optional(),
              imageAlt: z.string().optional(),
              links: z.array(link).default([]),
            }),
          )
          .default([]),
        results: results.optional(),
        gallery: z.array(z.object({ image: image(), alt: z.string() })).default([]),
        draft: z.boolean().default(false),
      })
      .refine((e) => !e.endDate || e.endDate >= e.date, {
        message: "endDate must be on or after date",
        path: ["endDate"],
      })
      .refine((e) => !e.hero || e.heroAlt, { message: "heroAlt is required with hero", path: ["heroAlt"] }),
});

/** YAML list loader that derives an `id` for each row. */
function yamlList(path: string, id: (row: Record<string, unknown>, i: number) => string) {
  return file(path, {
    parser: (text) =>
      (parseYaml(text) as Record<string, unknown>[]).map((row, i) => ({ id: id(row, i), ...row })),
  });
}

/** Every club-record-worthy performance. The records page shows the top 3 athletes. */
const performances = defineCollection({
  loader: yamlList("./src/data/performances.yaml", (_, i) => String(i)),
  schema: z.object({
    name: z.string(),
    distance: z.enum(["marathon", "half-marathon", "10km", "5km", "3000m"]),
    sex: z.enum(["men", "women"]),
    time: z.string().regex(/^\d{1,2}(:\d{2}){1,2}(\.\d{1,2})?$/, "Use h:mm:ss, mm:ss or mm:ss.cc"),
    year: z.number().int(),
    race: z.string().optional(),
  }),
});

const champions = defineCollection({
  loader: yamlList("./src/data/champions.yaml", (row) => String(row.year)),
  schema: z.object({ year: z.number().int(), men: z.string(), women: z.string() }),
});

const members = defineCollection({
  loader: yamlList("./src/data/members.yaml", (row) => `${row.first} ${row.last}`),
  schema: z.object({ first: z.string(), last: z.string() }),
});

export const collections = { events, performances, champions, members };
