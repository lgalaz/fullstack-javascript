export default function DocsCatchAllPage({ params }) {
  return (
    <main className="app">
      <header>
        <h1>Docs Catch-All</h1>
        <p>Segments: {params.slug.join(' / ')}</p>
      </header>
    </main>
  );
}
