export function dateInTimeZone(instant: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(instant);
  const part = (type: string) => parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function timeInTimeZone(instant: string, timeZone: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(new Date(instant));
}
