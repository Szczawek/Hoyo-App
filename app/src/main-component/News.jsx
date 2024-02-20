import Shelf from "../comment/Shelf";
export default function News() {
  return (
    <section className="news">
      <Shelf creator={true} />
    </section>
  );
}
