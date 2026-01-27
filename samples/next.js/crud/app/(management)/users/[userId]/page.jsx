export default function UserDetailPage({ params }) {
  return (
    <main className="app">
      <header>
        <h1>User Detail</h1>
        <p>Dynamic route param: {params.userId}</p>
      </header>
    </main>
  );
}
