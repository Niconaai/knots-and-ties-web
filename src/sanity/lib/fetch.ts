import { createClient, type QueryParams } from "next-sanity";
import { client } from "./client";

export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
}: {
  query: QueryString;
  params?: QueryParams;
}) {
  return client.fetch(query, params, {
    next: {
      revalidate: 0, // 0 = Always fresh data (Critical for Made-to-Order availability)
    },
  });
}