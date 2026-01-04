'use client';

import { useEffect, useRef, useState } from 'react';

const DATASET = [
  'apple',
  'apricot',
  'avocado',
  'banana',
  'blackberry',
  'blueberry',
  'cantaloupe',
  'cherry',
  'coconut',
  'cranberry',
  'dragonfruit',
  'fig',
  'grapefruit',
  'grape',
  'kiwi',
  'lemon',
  'lime',
  'mango',
  'nectarine',
  'orange',
  'papaya',
  'peach',
  'pear',
  'pineapple',
  'plum',
  'pomegranate',
  'raspberry',
  'strawberry',
  'tangerine',
  'watermelon',
];

function fakeSearch(query: string, signal: AbortSignal): Promise<string[]> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const timeout = setTimeout(() => {
      const lowered = query.trim().toLowerCase();
      if (!lowered) {
        resolve([]);
        return;
      }
      const matches = DATASET.filter((item) => item.includes(lowered));
      resolve(matches.slice(0, 6));
    }, 700);

    signal.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

export default function Page() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [status, setStatus] = useState('Type to search.');
  const controllerRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    if (!query.trim()) {
      controllerRef.current?.abort();
      setResults([]);
      setStatus('Type to search.');
      return;
    }

    setStatus('Waiting for debounce...');

    debounceRef.current = window.setTimeout(() => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setStatus('Searching...');
      fakeSearch(query, controller.signal)
        .then((data) => {
          setResults(data);
          setStatus(data.length ? 'Results ready.' : 'No matches.');
        })
        .catch((error) => {
          if (error?.name === 'AbortError') {
            setStatus('Request aborted.');
            return;
          }
          setStatus('Something went wrong.');
        });
    }, 400);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const windowController = new AbortController();
    const { signal } = windowController;

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setQuery('');
      }
    }

    function handleFocus() {
      if (!query.trim()) {
        setStatus('Type to search.');
      }
    }

    window.addEventListener('keydown', handleKey, { signal });
    window.addEventListener('focus', handleFocus, { signal });

    return () => {
      windowController.abort();
    };
  }, [query]);

  return (
    <main className="card">
      <header className="header">
        <h1>Search Autocomplete</h1>
        <p>
          Debounce the input, abort the old request, and only render the latest results.
        </p>
      </header>

      <section className="search">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try typing 'ap' or 'berry'"
        />
        <span className="status">{status}</span>
      </section>

      <section className="results">
        {results.length === 0 ? (
          <div className="status">No results yet.</div>
        ) : (
          results.map((item) => (
            <div className="result-item" key={item}>
              {item}
            </div>
          ))
        )}
      </section>

      <div className="hint">
        <div>
          Debounce waits 400ms before searching to reduce repeated calls while typing.
        </div>
        <div>
          Each new search creates a new <span className="code">AbortController</span> and
          aborts the previous request.
        </div>
      </div>
    </main>
  );
}
