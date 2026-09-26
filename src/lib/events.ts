import { getCollection, type CollectionEntry } from "astro:content";
import { SITE } from "../consts";

export type EventEntry = CollectionEntry<"events">;
export type EventStatus = "upcoming" | "live" | "completed";

/** Calendar day in Brisbane as YYYY-MM-DD, so comparisons ignore time of day. */
function day(d: Date): string {
  return d.toLocaleDateString("en-CA", { timeZone: SITE.timeZone });
}

/**
 * Status is worked out when the site is built: rebuild after an event to
 * move it from "upcoming" to "completed".
 */
export function eventStatus(event: EventEntry, now = new Date()): EventStatus {
  const today = day(now);
  const start = day(event.data.date);
  const end = day(event.data.endDate ?? event.data.date);
  if (today < start) return "upcoming";
  if (today <= end) return "live";
  return "completed";
}

/** All published events, newest first. */
export async function getEvents(): Promise<EventEntry[]> {
  const events = await getCollection("events", (e) => !e.data.draft);
  return events.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Upcoming and in-progress events, soonest first. */
export function currentEvents(events: EventEntry[]): EventEntry[] {
  return events
    .filter((e) => eventStatus(e) !== "completed")
    .sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf());
}

export function eventUrl(event: EventEntry): string {
  return `/events/${event.id}/`;
}

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(SITE.locale.replace("_", "-"), { timeZone: SITE.timeZone, ...opts });

const longDate = fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" });
const dayMonth = fmt({ day: "numeric", month: "short" });
const dayMonthYear = fmt({ day: "numeric", month: "short", year: "numeric" });

export const formatLongDate = (d: Date) => longDate.format(d);

/** "21 Nov 2025" or "13 Dec 2025 – 31 Jan 2026" */
export function formatDateRange(start: Date, end?: Date): string {
  if (!end || day(start) === day(end)) return dayMonthYear.format(start);
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  return `${(sameYear ? dayMonth : dayMonthYear).format(start)} – ${dayMonthYear.format(end)}`;
}

export const STATUS_LABEL: Record<EventStatus, string> = {
  upcoming: "Upcoming",
  live: "In progress",
  completed: "Results",
};
