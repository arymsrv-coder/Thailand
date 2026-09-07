import type { ActionResult } from './types';
import { validateBooking, validateContact, validateInquiry } from './validation';

/*
 * Form handling for the static build.
 *
 * This site is exported as files and has no server, so there is nowhere to
 * post a request to. These keep the same signatures the Server Actions had —
 * `(previous, formData)`, so `useActionState` is unchanged — and run the same
 * validation, which is pure and always ran on both sides anyway.
 *
 * What they cannot do is store anything. Rather than show a confirmation and a
 * reference number for a request that went nowhere, a valid submission hands
 * back a prefilled `mailto:` so the visitor's answers are not lost and they
 * can actually reach someone. Wiring this to a form service (Formspree,
 * Basin, a Worker) means replacing the body of these three functions and
 * nothing else.
 */

const CONTACT_EMAIL = 'hello@amarasiam.com';

/** A valid submission, handed back as a message the visitor can send. */
export type FormHandoff = {
  /** Prefilled mailto: URL carrying everything they typed. */
  mailto: string;
};

function handoff(subject: string, lines: string[]): ActionResult<FormHandoff> {
  const body = encodeURIComponent(lines.join('\n'));
  return {
    ok: true,
    value: { mailto: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${body}` },
  };
}

export async function submitBooking(
  _previous: ActionResult<FormHandoff> | null,
  formData: FormData
): Promise<ActionResult<FormHandoff>> {
  const parsed = validateBooking({
    tourId: formData.get('tourId'),
    name: formData.get('name'),
    email: formData.get('email'),
    date: formData.get('date'),
    guests: formData.get('guests'),
  });
  if (!parsed.ok) return parsed;

  const { name, email, date, guests, tourId } = parsed.value;
  return handoff(`Tour booking request — ${tourId}`, [
    `Tour: ${tourId}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Preferred date: ${date}`,
    `Guests: ${guests}`,
  ]);
}

export async function submitInquiry(
  _previous: ActionResult<FormHandoff> | null,
  formData: FormData
): Promise<ActionResult<FormHandoff>> {
  const parsed = validateInquiry({
    kind: formData.get('kind'),
    itemId: formData.get('itemId'),
    itemLabel: formData.get('itemLabel'),
    name: formData.get('name'),
    email: formData.get('email'),
    date: formData.get('date'),
    travelers: formData.get('travelers'),
  });
  if (!parsed.ok) return parsed;

  const { kind, itemLabel, name, email, date, travelers } = parsed.value;
  return handoff(`${kind} request — ${itemLabel}`, [
    `${kind}: ${itemLabel}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Preferred date: ${date}`,
    `Travelers: ${travelers}`,
  ]);
}

export async function submitContact(
  _previous: ActionResult<FormHandoff> | null,
  formData: FormData
): Promise<ActionResult<FormHandoff>> {
  const parsed = validateContact({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });
  if (!parsed.ok) return parsed;

  const { name, email, message } = parsed.value;
  return handoff('Enquiry from the Amara Siam site', [
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    message,
  ]);
}
