const relativeTime = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
  style: "short",
});

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

export function formatRelativeTime(date: Date, now = new Date()) {
  const elapsed = date.getTime() - now.getTime();

  if (Math.abs(elapsed) < MINUTE) {
    return relativeTime.format(Math.round(elapsed / SECOND), "second");
  }
  if (Math.abs(elapsed) < HOUR) {
    return relativeTime.format(Math.round(elapsed / MINUTE), "minute");
  }
  if (Math.abs(elapsed) < DAY) {
    return relativeTime.format(Math.round(elapsed / HOUR), "hour");
  }
  if (Math.abs(elapsed) < WEEK) {
    return relativeTime.format(Math.round(elapsed / DAY), "day");
  }
  if (Math.abs(elapsed) < MONTH) {
    return relativeTime.format(Math.round(elapsed / WEEK), "week");
  }
  if (Math.abs(elapsed) < YEAR) {
    return relativeTime.format(Math.round(elapsed / MONTH), "month");
  }
  return relativeTime.format(Math.round(elapsed / YEAR), "year");
}

export function getConversationSectionLabel(date: Date, now = new Date()) {
  const diffDays = Math.floor((now.getTime() - date.getTime()) / DAY);

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return "Previous 7 Days";
  if (diffDays < 30) return "Previous 30 Days";

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
