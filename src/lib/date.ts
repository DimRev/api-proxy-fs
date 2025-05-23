export function relativeDateString(timestamp: number): string {
  const now = Date.now();
  const elapsedMilliseconds = now - timestamp;

  if (elapsedMilliseconds < 0) {
    return "in the future";
  }
  if (elapsedMilliseconds < 1000) {
    return "just now";
  }

  const units: Array<{
    name: string;
    pluralName: string;
    milliseconds: number;
    threshold?: number;
  }> = [
    {
      name: "year",
      pluralName: "years",
      milliseconds: 365 * 24 * 60 * 60 * 1000,
    },
    {
      name: "month",
      pluralName: "months",
      milliseconds: 30 * 24 * 60 * 60 * 1000,
    },
    {
      name: "week",
      pluralName: "weeks",
      milliseconds: 7 * 24 * 60 * 60 * 1000,
    },
    { name: "day", pluralName: "days", milliseconds: 24 * 60 * 60 * 1000 },
    { name: "hour", pluralName: "hours", milliseconds: 60 * 60 * 1000 },
    { name: "minute", pluralName: "minutes", milliseconds: 60 * 1000 },
    { name: "second", pluralName: "seconds", milliseconds: 1000 },
  ];

  for (const unit of units) {
    if (elapsedMilliseconds >= unit.milliseconds) {
      const count = Math.floor(elapsedMilliseconds / unit.milliseconds);
      return `${count} ${count === 1 ? unit.name : unit.pluralName} ago`;
    }
  }

  return "just now";
}
