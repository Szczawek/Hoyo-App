import ComShelf from "../comments/ComShelf";
export default function News() {
  return (
    <section className="news">
      <ComShelf type={0} source="comments" addSource="add-comment" />
    </section>
  );
}
