'use client';

import { useId, useState } from 'react';
import { faqs } from '@/lib/faqs';
import { ChevronDownIcon } from './icons';
import Reveal from './motion/Reveal';
import SplitText from './motion/SplitText';

export default function Faq() {
  const baseId = useId();

  // Only one answer is open at a time; clicking the open one closes it.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="faq-layout">
          <div className="faq-intro">
            <Reveal as="p" className="eyebrow" distance="sm">
              Good to know
            </Reveal>
            <h2>
              <SplitText lines={['Frequently asked questions.']} accentFrom={2} />
            </h2>
            <p className="faq-sub">
              Everything to know before you land — visas, money, weather, and
              getting around.
            </p>
          </div>

          <div className="faq-accordion">
            {faqs.map((faq, index) => {
              const isOpen = index === openIndex;
              const answerId = `${baseId}-${index}`;
              return (
                <Reveal
                  key={faq.question}
                  delay={Math.min(index, 5) * 45}
                  distance="sm"
                  className={`faq-item${isOpen ? ' is-open' : ''}`}
                >
                  <button
                    className="faq-question"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <ChevronDownIcon />
                  </button>
                  <div className="faq-answer" id={answerId}>
                    <p>{faq.answer}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
