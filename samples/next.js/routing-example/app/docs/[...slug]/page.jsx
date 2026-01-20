export default function DocsPage({ params }) {
  return (
    <section className="card">
      <h1>Docs catch-all</h1>
      <p>Segments: {params.slug.join(' / ')}</p>
    </section>
  );
}
