"use client";

import { useEffect, useMemo, useState } from "react";

import { formatConversationAbsoluteTime, formatRelativeTime } from "@/lib/utils/date";

const REFRESH_INTERVAL_MS = 30_000;

export function useRelativeTime(input: string | Date) {
  const date = useMemo(() => (input instanceof Date ? input : new Date(input)), [input]);
  const absolute = useMemo(() => formatConversationAbsoluteTime(date), [date]);
  const [relative, setRelative] = useState(absolute);

  useEffect(() => {
    const update = () => setRelative(formatRelativeTime(date));
    update();

    const id = window.setInterval(update, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [date]);

  return {
    relative,
    absolute,
  };
}
