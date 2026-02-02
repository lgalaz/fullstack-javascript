import AnalyticsDashboard from '../components/microfrontends/AnalyticsDashboard';
import UserManagement from '../components/microfrontends/UserManagement';
import SupportInbox from '../components/microfrontends/SupportInbox';
import Button from '../components/ui/Button';

export default function Home() {
  return (
    <main className="shell">
      <nav className="shell-nav">
        <div className="shell-brand">
          <span className="shell-dot" />
          <div>
            <p>Orbit Ops</p>
            <span>Microfrontends shell</span>
          </div>
        </div>
        <div className="shell-links">
          <Button variant="ghost">Overview</Button>
          <Button variant="ghost">Teams</Button>
          <Button>Create report</Button>
        </div>
      </nav>

      <header className="shell-hero">
        <div>
          <p className="eyebrow">Composable UI demo</p>
          <h1>One shell, three focused frontends.</h1>
          <p className="lead">
            Each card below represents a microfrontend owned by a different team.
            The shell provides navigation, shared styling, and layout while each
            microfrontend owns its data and UI.
          </p>
        </div>
        <div className="shell-summary">
          <div>
            <h3>Shell responsibilities</h3>
            <ul>
              <li>Global navigation + layout</li>
              <li>Shared design tokens</li>
              <li>Auth, routing, observability</li>
            </ul>
          </div>
          <div>
            <h3>Microfrontend responsibilities</h3>
            <ul>
              <li>Feature-specific UI</li>
              <li>Scoped data contracts</li>
              <li>Independent release cadence</li>
            </ul>
          </div>
        </div>
      </header>

      <section className="shell-grid">
        <AnalyticsDashboard />
        <UserManagement />
        <SupportInbox />
      </section>

      <section className="shell-integration">
        <div>
          <h2>How this maps to a real microfrontend setup</h2>
          <p>
            In production, each section could live in its own repo and deploy
            independently. The shell would load them via module federation,
            iframes, or edge-side composition. This sample keeps them together
            to make the structure easy to follow.
          </p>
        </div>
        <div className="integration-cards">
          <div>
            <h4>Team A: Analytics</h4>
            <p>Owns KPIs, charts, and experimentation.</p>
          </div>
          <div>
            <h4>Team B: Users</h4>
            <p>Owns access control, profiles, and org settings.</p>
          </div>
          <div>
            <h4>Team C: Ops</h4>
            <p>Owns alerts, incident response, and workflows.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
