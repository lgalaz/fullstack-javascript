export default function Badge({ children, tone = 'neutral' }) {
  const className = ['ui-badge', `ui-badge--${tone}`].join(' ');

  return <span className={className}>{children}</span>;
}
