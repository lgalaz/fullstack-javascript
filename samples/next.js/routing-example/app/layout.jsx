import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Next.js Routing Example',
  description: 'App Router fundamentals with users, posts, and comments.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <Link href="/">Home</Link>
          <Link href="/about">About (route group)</Link>
          <Link href="/pricing">Pricing (route group)</Link>
          <Link href="/users">Users (dynamic)</Link>
          <Link href="/docs/app/router">Docs (catch-all)</Link>
          <Link href="/help">Help (optional catch-all)</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
