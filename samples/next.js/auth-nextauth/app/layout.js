import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'NextAuth Credentials Demo',
  description: 'A Next.js auth sample using NextAuth credentials provider.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="page">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
