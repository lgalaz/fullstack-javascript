export default function HelpPage({ params }) {
  const slug = params.slug ?? [];
  return (
    <section className="card">
      <h1>Help (optional catch-all)</h1>
      <p>{slug.length ? `Path: ${slug.join(' / ')}` : 'Root help page.'}</p>
    </section>
  );
}
