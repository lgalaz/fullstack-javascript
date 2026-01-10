export const metadata = {
  title: 'Dev Overlay Lab',
  description: 'Triggers warnings and errors to show the Next.js dev overlay.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
