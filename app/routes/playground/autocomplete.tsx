import { useEffect, useRef, useState } from 'react';
import { Form, json, LoaderFunction, useFetcher, useLoaderData } from 'remix';

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
    const fetcher = useFetcher<LoaderData>();
    // Prefer realtime fetcher results
    const data: LoaderData = fetcher.data || loaderData;

    // Autocomplete via useFetcher
    useEffect(() => {
        if (
            !formEl?.current ||
            query === loaderData.query ||
            query.length < 3
        ) {
            return;
        }
        const formData = new FormData(formEl.current);
        const qs = new URLSearchParams(formData as any);
        fetcher.load(`${window.location.pathname}?${qs}`);
    }, [query]);

    return (
        <>
            <h2>Autocomplete example</h2>
            <p>
                JS-disabled performs a GET form submission with a query
                parameter, while JS-enabled provides auto-search via useFetcher
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
                            <img src={r.poster} style={{ width: '100%' }} />
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
