import './globals.css';

export const metadata = {
  title: 'Next.js Items List',
  description: 'Server-rendered list of users with Next.js.',
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
