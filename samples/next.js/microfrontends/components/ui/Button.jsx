export default function Button({ children, variant = 'solid', ...props }) {
  const className = ['ui-button', variant === 'ghost' && 'ui-button--ghost']
    .filter(Boolean)
    .join(' ');

  return (
    <button className={className} type="button" {...props}>
      {children}
    </button>
  );
}
