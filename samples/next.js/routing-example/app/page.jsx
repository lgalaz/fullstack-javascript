import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="grid grid-2">
      <section className="card">
        <h1>Routing Fundamentals Showcase</h1>
        <p>
          This sample demonstrates App Router features using users, posts, and
          comments.
        </p>
        <ul>
          <li>
            Route groups: <Link href="/about">/about</Link>,{' '}
            <Link href="/pricing">/pricing</Link>
          </li>
          <li>
            Dynamic routes: <Link href="/users/1">/users/1</Link>
          </li>
          <li>
            Whitelist demo: <Link href="/whitelist-users/1">/whitelist-users/1</Link>
          </li>
          <li>
            Catch-all: <Link href="/docs/app/router">/docs/app/router</Link>
          </li>
          <li>
            Optional catch-all: <Link href="/help">/help</Link>
          </li>
        </ul>
      </section>
      <section className="card">
        <h2>Try these</h2>
        <ul>
          <li>
            <Link href="/users/1/posts/p1">User 1, Post p1</Link>
          </li>
          <li>
            <Link href="/users/1/posts/p1/comments/c1">Comment c1</Link>
          </li>
          <li>
            <Link href="/users/2/posts/p3">User 2, Post p3</Link>
          </li>
        </ul>
        <p>
          Navigate from a post to a comment to see the intercepting modal route.
        </p>
      </section>
    </div>
  );
}
