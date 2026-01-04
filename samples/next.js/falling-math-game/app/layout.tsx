import './globals.css';

export const metadata = {
  title: 'Falling Math Game',
  description: 'A falling math arcade game built with Next.js and React.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="page-shell">{children}</div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                  for (const entry of list.getEntries()) {
                    console.log('Long task entry:', entry);
                    console.log('Long task details:', {
                      name: entry.name,
                      startTime: entry.startTime,
                      duration: entry.duration,
                      attribution: entry.attribution?.map((a) => ({
                        name: a.name,
                        entryType: a.entryType,
                        startTime: a.startTime,
                        duration: a.duration,
                        containerType: a.containerType,
                        containerName: a.containerName,
                        containerId: a.containerId,
                        containerSrc: a.containerSrc,
                      })),
                    });
                  }
                });

                observer.observe({ entryTypes: ['longtask'], buffered: true });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
