import dynamic from 'next/dynamic';

const AnalyticsDashboard = dynamic(() => import('analytics/AnalyticsDashboard'), {
  ssr: false,
  loading: () => <div className="panel">Loading analytics...</div>,
});

const UserManagement = dynamic(() => import('users/UserManagement'), {
  ssr: false,
  loading: () => <div className="panel">Loading users...</div>,
});

const OpsPulse = dynamic(() => import('ops/OpsPulse'), {
  ssr: false,
  loading: () => <div className="panel">Loading ops...</div>,
});

export default function Home() {
  return (
    <main className="shell">
      <header className="shell-header">
        <div>
          <p className="eyebrow">Module Federation Shell</p>
          <h1>One shell. Three remote apps.</h1>
          <p>
            The shell loads each remote at runtime. Each card below is rendered
            by a separate Next.js app running on its own port.
          </p>
        </div>
        <div className="shell-meta">
          <div>
            <h3>Shell owns</h3>
            <ul>
              <li>Layout & navigation</li>
              <li>Runtime composition</li>
              <li>Shared tokens</li>
            </ul>
          </div>
          <div>
            <h3>Remotes own</h3>
            <ul>
              <li>Feature UI</li>
              <li>Feature data</li>
              <li>Release cadence</li>
            </ul>
          </div>
        </div>
      </header>

      <section className="grid">
        <AnalyticsDashboard />
        <UserManagement />
        <OpsPulse />
      </section>
    </main>
  );
}
