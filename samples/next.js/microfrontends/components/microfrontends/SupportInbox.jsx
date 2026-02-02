import { getOpsTickets } from '../../lib/bff';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';

export default function SupportInbox() {
const supportTickets = getOpsTickets();
  const priorityTone = {
    High: 'danger',
    Medium: 'warning',
    Low: 'success',
  };

  return (
    <section className="microfrontend" aria-labelledby="support-title">
      <SectionHeader
        eyebrow="Microfrontend"
        title="Ops pulse"
        subtitle="Cross-team alerts and escalations in one view."
        tag="Remote: ops"
        id="support-title"
      />

      <div className="ticket-list">
        {supportTickets.map((ticket) => (
          <Card key={ticket.title} className="ticket">
            <div>
              <h3>{ticket.title}</h3>
              <p>
                {ticket.channel} - {ticket.owner}
              </p>
            </div>
            <div className="ticket__meta">
              <Badge tone={priorityTone[ticket.priority] || 'neutral'}>
                {ticket.priority}
              </Badge>
              <span className="ticket__time">{ticket.time}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="ops-summary">
        <div>
          <h4>Escalations</h4>
          <p>2 new incidents</p>
        </div>
        <div>
          <h4>Queues</h4>
          <p>5 pending approvals</p>
        </div>
      </div>
    </section>
  );
}
