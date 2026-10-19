import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

type Sql = NeonQueryFunction<false, false>;

let client: Sql | null = null;

function getSql(): Sql {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    client = neon(url);
  }
  return client;
}

/** Opens the database on the first query, so pages that only check a cookie still render. */
export const sql: Sql = new Proxy((() => undefined) as unknown as Sql, {
  apply(_target, thisArg, args: unknown[]) {
    return Reflect.apply(getSql() as unknown as (...a: unknown[]) => unknown, thisArg, args);
  },
  get(_target, prop, receiver) {
    const value = Reflect.get(getSql(), prop, receiver) as unknown;
    return typeof value === "function" ? (value as (...a: unknown[]) => unknown).bind(getSql()) : value;
  },
});
