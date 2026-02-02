import './globals.css';

export const metadata = {
  title: 'Next.js Microfrontends Sample',
  description: 'A microfrontend-inspired layout built with Next.js App Router.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="page">{children}</div>
      </body>
    </html>
  );
}
