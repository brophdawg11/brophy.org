import { useEffect, useRef, useState } from 'react';
import type { LoaderFunction, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useFetcher, useLoaderData } from '@remix-run/react';

type ApiMovie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

type ApiResponse = {
  Response: 'True' | 'False';
  Error?: string;
  Search: ApiMovie[];
};

type LoaderData = {
  query?: string;
  results?: {
    title: string;
    poster: string;
  }[];
  error?: string;
};

const cache: Record<string, ApiResponse> = {};

// See: https://usehooks.com/useDebounce/
function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export const meta: V2_MetaFunction<typeof loader, { root: any }> = ({
  data,
  matches,
}) => {
  return [
    // @ts-expect-error
    ...matches[0].meta.filter((o) => !o.title && o.name !== 'description'),
    { title: `Results: ${data.query}` },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const query = new URL(request.url).searchParams.get('query')?.toLowerCase();
  if (!query) {
    return json<LoaderData>({});
  }

  let data = cache[query];
  if (!data) {
    const qs = new URLSearchParams({
      apiKey: process.env.OMDB_API_KEY || '',
      s: query,
    });
    const url = new URL(`https://www.omdbapi.com/?${qs}`);
    const res = await fetch(url.toString());
    data = (await res.json()) as ApiResponse;
    cache[query] = data;
  }

  if (Object.keys(cache).length > 100) {
    for (const key in cache) {
      delete cache[key];
    }
  }

  return json<LoaderData>({
    query,
    results: data.Search?.map((m) => ({
      title: m.Title,
      poster: m.Poster,
    })),
    error: data.Error,
  });
};

export default function Autocomplete() {
  const loaderData = useLoaderData<LoaderData>();
  const formEl = useRef(null);
  const [query, setQuery] = useState(loaderData.query || '');
  const debouncedQuery = useDebounce(query, 300);
  const fetcher = useFetcher<LoaderData>();
  // Prefer realtime fetcher results
  const data: LoaderData = fetcher.data || loaderData;

  // Autocomplete via useFetcher
  useEffect(() => {
    if (
      !formEl?.current ||
      debouncedQuery === loaderData.query ||
      debouncedQuery.length < 3
    ) {
      return;
    }
    const formData = new FormData(formEl.current);
    const qs = new URLSearchParams(formData as any);
    fetcher.load(`${window.location.pathname}?${qs}`);
  }, [debouncedQuery, fetcher, loaderData.query]);

  return (
    <>
      <h2>Autocomplete example</h2>
      <p>
        JS-disabled performs a GET form submission with a query parameter, while
        JS-enabled provides auto-search via useFetcher
      </p>
      <br />

      <Form ref={formEl} method="get">
        <label>
          Search for Movies!
          <br />
          <input
            name="query"
            onChange={(e) => setQuery(e.target.value)}
            value={query}></input>
        </label>
        <button type="submit">Search</button>
      </Form>
      <br />

      {data.error && <p style={{ color: 'red' }}>{data.error}</p>}

      {data?.results && (
        <ul
          style={{
            listStyleType: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridColumnGap: 0,
          }}>
          {data.results.map((r, i) => (
            <li key={i}>
              <img
                src={r.poster}
                alt={`Movie poster for "${r.title}"`}
                style={{ width: '100%' }}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}