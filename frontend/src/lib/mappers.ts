/* ------------------------------------------------------------------ */
/* snake_case  ↔  camelCase  mappers                                   */
/* ------------------------------------------------------------------ */

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
function camelToSnake(s: string): string {
  return s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

/** Map a DB row (snake_case) → TS object (camelCase) */
export function fromDb<T>(row: Record<string, unknown>): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    out[snakeToCamel(k)] = v;
  }
  return out as T;
}

/** Map a TS object (camelCase) → DB row (snake_case) */
export function toDb<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[camelToSnake(k)] = v;
  }
  return out;
}

/** Map an array of DB rows */
export function fromDbArray<T>(rows: Record<string, unknown>[]): T[] {
  return rows.map((r) => fromDb<T>(r));
}
