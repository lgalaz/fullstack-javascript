import { getAnalyticsData } from '../../lib/bff';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';

export default function AnalyticsDashboard() {
  const analytics = getAnalyticsData();

  return (
    <section className="microfrontend" aria-labelledby="analytics-title">
      <SectionHeader
        eyebrow="Microfrontend"
        title="Analytics dashboard"
        subtitle="Tracks growth, conversion, and traffic mix."
        tag="Remote: analytics"
        id="analytics-title"
      />

      <div className="stat-grid">
        {analytics.cards.map((card) => (
          <Card key={card.label} className="stat-card">
            <p className="stat-card__label">{card.label}</p>
            <div className="stat-card__value">{card.value}</div>
            <span className="stat-card__trend">{card.trend}</span>
          </Card>
        ))}
      </div>

      <Card className="chart-card">
        <div className="chart-card__header">
          <h3>Weekly traffic</h3>
          <span>Last 7 days</span>
        </div>
        <svg
          className="chart-card__svg"
          viewBox="0 0 320 120"
          role="img"
          aria-label="Traffic trend"
        >
          <defs>
            <linearGradient id="chart-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffb15a" />
              <stop offset="100%" stopColor="#5aa6ff" />
            </linearGradient>
          </defs>
          <path
            d="M0 90 C40 70 60 35 90 38 C120 41 140 80 170 76 C200 72 215 30 245 28 C275 26 295 55 320 40"
            fill="none"
            stroke="url(#chart-gradient)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="90" cy="38" r="4" fill="#ffb15a" />
          <circle cx="170" cy="76" r="4" fill="#ffc97e" />
          <circle cx="245" cy="28" r="4" fill="#5aa6ff" />
        </svg>
      </Card>

      <div className="traffic-list">
        {analytics.traffic.map((source) => (
          <div key={source.label} className="traffic-item">
            <span>{source.label}</span>
            <div className="traffic-meter">
              <span style={{ width: `${source.value}%` }} />
            </div>
            <strong>{source.value}%</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
