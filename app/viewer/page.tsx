export const metadata = { title: "Viewer" };

export default function ViewerPage() {
  return (
    <section className="prose dark:prose-invert max-w-none">
      <h1>Markdown Viewer</h1>
      <p>
        Drag a <code>.md</code> file anywhere on this page to render it locally.
      </p>
      <p className="italic text-muted-foreground">
        Rendering engine will be implemented in Lesson 1.3.
      </p>
    </section>
  );
}