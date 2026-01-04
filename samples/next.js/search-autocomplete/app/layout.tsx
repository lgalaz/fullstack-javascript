import './globals.css';

export const metadata = {
  title: 'Search Autocomplete Demo',
  description: 'Debounced autocomplete with AbortController in Next.js.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="page">{children}</div>
      </body>
    </html>
  );
}
