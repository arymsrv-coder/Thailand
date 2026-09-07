import { packageFaqs } from '@/lib/faqs';

/**
 * The reference shows this block fully expanded rather than as an accordion,
 * so it reads as one page of copy — same here.
 */
export default function PackagesFaq() {
  return (
    <section className="lp-faq">
      <h2>Everything you need to know about Amara Siam packages</h2>
      <dl>
        {packageFaqs.map((faq) => (
          <div key={faq.question}>
            <dt>{faq.question}</dt>
            <dd>{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
