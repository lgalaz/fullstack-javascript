import './globals.css';

export const metadata = {
  title: 'Next.js CRUD Sample',
  description: 'A CRUD example in Next.js using client state.',
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
