import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import SectionHeader from '../components/ui/SectionHeader';

export default {
  title: 'Design System/Overview',
};

export function Overview() {
  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      <SectionHeader
        eyebrow="Design system"
        title="Shared UI primitives"
        subtitle="Buttons, badges, cards, and section headers."
        tag="v0.1"
      />

      <Card>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button>Primary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </Card>

      <Card>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Badge>Neutral</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
        </div>
      </Card>
    </div>
  );
}
