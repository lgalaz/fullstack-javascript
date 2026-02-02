const kpis = [
  { label: 'Active users', value: '12.4k', trend: '+8%' },
  { label: 'Conversion', value: '3.9%', trend: '+0.4%' },
  { label: 'Avg order', value: '$62.10', trend: '-1.2%' },
];

export default function AnalyticsDashboard() {
  return (
    <section className="panel" aria-labelledby="analytics-title">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Remote app</p>
          <h2 id="analytics-title">Analytics</h2>
          <p>Growth and funnel health owned by the Analytics team.</p>
        </div>
        <span className="tag">analytics@3001</span>
      </header>

      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="kpi-card">
            <span>{kpi.label}</span>
            <strong>{kpi.value}</strong>
            <em>{kpi.trend}</em>
          </div>
        ))}
      </div>
    </section>
  );
}
