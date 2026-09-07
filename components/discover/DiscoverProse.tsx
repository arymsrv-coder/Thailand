import type { ProseEntry } from '@/lib/discover';

/**
 * The long-form block that closes both reference pages: a heading over a run
 * of question-and-answer pairs. Things to Do sets them in two columns, Cruises
 * in one, so the column count is a prop.
 */
export default function DiscoverProse({
  heading,
  entries,
  columns = 2,
}: {
  heading: string;
  entries: ProseEntry[];
  columns?: 1 | 2;
}) {
  return (
    <section className="dsc-section dsc-prose">
      <h2 className="dsc-heading">{heading}</h2>
      <dl className={columns === 2 ? 'dsc-prose-cols' : undefined}>
        {entries.map((entry) => (
          <div key={entry.question}>
            <dt>{entry.question}</dt>
            <dd>{entry.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
