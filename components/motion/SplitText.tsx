'use client';

import { Fragment, useEffect, useRef, useState } from 'react';

/*
 * A heading that arrives a word at a time, each word rising into place behind
 * a clipped edge — the effect Studio Aurora uses on its headings.
 *
 * The words are real text in the DOM, one <span> each, so the heading is still
 * read and selected as a single sentence. Line breaks are explicit rather than
 * inferred, because a word-wrapped mask would clip mid-line as the viewport
 * changes.
 */

const STAGGER_MS = 38;

export default function SplitText({
  lines,
  delay = 0,
  className,
  accentFrom,
}: {
  lines: string[];
  delay?: number;
  className?: string;
  /**
   * Word index (counting across all lines) from which words carry `.accent`,
   * for headings that emphasise their closing phrase.
   */
  accentFrom?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0, rootMargin: '0px 0px -6% 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  let wordIndex = 0;

  return (
    <span
      ref={ref}
      className={`split${isVisible ? ' is-in' : ''}${className ? ` ${className}` : ''}`}
    >
      {lines.map((line, lineNumber) => (
        <span className="split-line" key={`${line}-${lineNumber}`}>
          {line.split(' ').map((word, index, words) => {
            const offset = delay + wordIndex * STAGGER_MS;
            const isAccent = accentFrom !== undefined && wordIndex >= accentFrom;
            wordIndex += 1;
            return (
              <Fragment key={`${word}-${index}`}>
                <span className={`split-word${isAccent ? ' accent' : ''}`}>
                  <span
                    className="split-word-inner"
                    style={{ transitionDelay: `${offset}ms` }}
                  >
                    {word}
                  </span>
                </span>
                {/*
                  * The separator sits between the word spans, not inside them:
                  * .split-word clips its overflow, which swallows a trailing
                  * space and runs the whole heading together.
                  */}
                {index < words.length - 1 ? ' ' : ''}
              </Fragment>
            );
          })}
        </span>
      ))}
    </span>
  );
}
