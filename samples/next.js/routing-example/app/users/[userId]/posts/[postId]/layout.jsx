export default function PostLayout({ children, modal }) {
  return (
    <section>
      {children}
      {modal}
    </section>
  );
}
