'use client';

import { useActionState } from 'react';
import type { ActionResult } from '@/lib/types';
import { submitContact, type FormHandoff } from '@/lib/forms';
import { CheckCircleIcon } from './icons';
import Reveal from './motion/Reveal';
import SplitText from './motion/SplitText';

/*
 * The contact form. "Contact Us" in the navbar and footer pointed at the
 * footer's address block, which had nothing to fill in — this is what those
 * links now lead to.
 */
export default function Contact() {
  const [state, formAction, isPending] = useActionState<
    ActionResult<FormHandoff> | null,
    FormData
  >(submitContact, null);

  const isSent = state?.ok === true;
  const errors = state && !state.ok ? state.errors : {};

  return (
    <section className="contact" id="contact">
      <div className="container contact-layout">
        <Reveal className="contact-intro">
          <p className="eyebrow">Talk to us</p>
          <h2>
            <SplitText lines={['Planning something', 'less standard?']} />
          </h2>
          <p className="contact-sub">
            Private guides, longer routes, families, anything off this page —
            tell us roughly what you have in mind and a coordinator will write
            back within a day.
          </p>
          <div className="contact-direct">
            <a href="mailto:hello@amarasiam.com">hello@amarasiam.com</a>
            <a href="tel:+6621234567">+66 2 123 4567</a>
          </div>
        </Reveal>

        <Reveal className="contact-form-card" delay={120}>
          {isSent ? (
            <div className="contact-success" aria-live="polite">
              <CheckCircleIcon />
              <h3>Almost there</h3>
              <p>
                This site is published as static files, so it cannot send your
                message itself. Your note is ready in an email — send it and we
                will reply within one working day.
              </p>
              {state?.ok && (
                <a className="btn btn-primary" href={state.value.mailto}>
                  Send by email
                </a>
              )}
            </div>
          ) : (
            <form className="contact-form" action={formAction} noValidate>
              {errors.form && (
                <p className="form-error form-error-block" role="alert">
                  {errors.form}
                </p>
              )}

              <label>
                <span>Your name</span>
                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'contactNameError' : undefined}
                />
                {errors.name && (
                  <span className="form-error" id="contactNameError">
                    {errors.name}
                  </span>
                )}
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'contactEmailError' : undefined}
                />
                {errors.email && (
                  <span className="form-error" id="contactEmailError">
                    {errors.email}
                  </span>
                )}
              </label>

              <label>
                <span>What are you planning?</span>
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder="Two weeks in February, Bangkok and the islands, travelling with two children…"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'contactMessageError' : undefined}
                />
                {errors.message && (
                  <span className="form-error" id="contactMessageError">
                    {errors.message}
                  </span>
                )}
              </label>

              <button
                className="btn btn-primary btn-block"
                type="submit"
                disabled={isPending}
              >
                {isPending ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
