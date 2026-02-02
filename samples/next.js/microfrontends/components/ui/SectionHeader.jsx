export default function SectionHeader({ id, eyebrow, title, subtitle, tag }) {
  return (
    <header className="section-header">
      <div>
        {eyebrow ? <p className="section-header__eyebrow">{eyebrow}</p> : null}
        <h2 className="section-header__title" id={id}>
          {title}
        </h2>
        {subtitle ? (
          <p className="section-header__subtitle">{subtitle}</p>
        ) : null}
      </div>
      {tag ? <span className="section-header__tag">{tag}</span> : null}
    </header>
  );
}
