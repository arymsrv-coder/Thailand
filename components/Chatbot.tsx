'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { findAnswer, suggestedPrompts } from '@/lib/chatbot';
import { CONTACT_EMAIL } from '@/lib/forms';
import { CloseIcon, HeadsetIcon } from './icons';

type Message = {
  id: number;
  role: 'bot' | 'visitor';
  text: string;
  link?: { href: string; label: string };
};

const GREETING: Message = {
  id: 0,
  role: 'bot',
  text: "Hi! I'm the Amara Siam assistant. Ask me about visas, booking, or any of our trips — or pick a question below.",
};

const FALLBACK = (
  <>
    I don&rsquo;t have an answer for that yet. Try rephrasing, or write to{' '}
    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and a coordinator will help.
  </>
);

/**
 * A client-side FAQ assistant, not a language model — the site is a static
 * export with no server to call one (see next.config.ts). Answers come from
 * `lib/chatbot`'s keyword-matched knowledge base, so every reply is one this
 * site actually stands behind.
 */
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [draft, setDraft] = useState('');
  const nextId = useRef(1);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    function handlePointerDown(event: PointerEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const match = findAnswer(trimmed);
    setMessages((current) => [
      ...current,
      { id: nextId.current++, role: 'visitor', text: trimmed },
      {
        id: nextId.current++,
        role: 'bot',
        text: match?.answer ?? '',
        link: match?.link,
      },
    ]);
    setDraft('');
  }

  return (
    <div className="chatbot">
      <button
        type="button"
        className="chatbot-toggle"
        aria-expanded={isOpen}
        aria-controls={titleId}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <CloseIcon width={20} height={20} /> : <HeadsetIcon width={22} height={22} />}
        <span className="sr-only">{isOpen ? 'Close chat' : 'Chat with us'}</span>
      </button>

      <div className={`chatbot-panel${isOpen ? ' is-open' : ''}`} ref={panelRef} role="dialog" aria-modal="false" aria-labelledby={titleId}>
        <div className="chatbot-header">
          <span id={titleId}>Amara Siam Assistant</span>
          <button type="button" className="chatbot-close" aria-label="Close chat" onClick={() => setIsOpen(false)}>
            <CloseIcon width={16} height={16} />
          </button>
        </div>

        <div className="chatbot-log" ref={logRef} aria-live="polite">
          {messages.map((message) => (
            <div key={message.id} className={`chatbot-message chatbot-message--${message.role}`}>
              <p>{message.text || FALLBACK}</p>
              {message.link && (
                message.link.href.startsWith('/') ? (
                  <Link href={message.link.href} className="chatbot-link">
                    {message.link.label}
                  </Link>
                ) : (
                  <a href={message.link.href} className="chatbot-link">
                    {message.link.label}
                  </a>
                )
              )}
            </div>
          ))}
        </div>

        {messages.length === 1 && (
          <div className="chatbot-suggestions">
            {suggestedPrompts.map((prompt) => (
              <button key={prompt} type="button" className="chatbot-chip" onClick={() => ask(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
        )}

        <form
          className="chatbot-composer"
          onSubmit={(event) => {
            event.preventDefault();
            ask(draft);
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask a question…"
            aria-label="Ask a question"
          />
          <button type="submit" disabled={!draft.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
