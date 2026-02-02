const alerts = [
  { title: 'Checkout latency spike', owner: 'SRE', time: 'Just now' },
  { title: 'VIP onboarding', owner: 'CS', time: '22m ago' },
  { title: 'Incident drill scheduled', owner: 'Ops', time: '1h ago' },
];

export default function OpsPulse() {
  return (
    <section className="panel" aria-labelledby="ops-title">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Remote app</p>
          <h2 id="ops-title">Ops pulse</h2>
          <p>Alerts and escalations owned by the Ops team.</p>
        </div>
        <span className="tag">ops@3003</span>
      </header>

      <div className="alerts">
        {alerts.map((alert) => (
          <div key={alert.title} className="alert">
            <div>
              <strong>{alert.title}</strong>
              <span>{alert.owner}</span>
            </div>
            <span className="time">{alert.time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
