import { CONTACT_EMAIL } from './forms';
import { faqs, packageFaqs } from './faqs';
import type { FaqEntry } from './types';

/*
 * The site assistant's knowledge base and matcher.
 *
 * There is no server to send a question to (see next.config.ts), so this
 * runs entirely in the browser: a fixed set of question/answer entries,
 * matched by keyword overlap against whatever the visitor typed. It is not
 * a language model — it is a fast, honest FAQ lookup that degrades to a
 * "here's a human" answer rather than guessing.
 */

export type ChatEntry = {
  id: string;
  /** Shown as a suggested chip; also the text sent when a chip is clicked. */
  prompt: string;
  answer: string;
  /** Extra match words beyond what's already in the prompt/answer text. */
  extraKeywords?: string[];
  link?: { href: string; label: string };
};

const STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'to', 'of',
  'and', 'or', 'in', 'on', 'at', 'for', 'with', 'do', 'does', 'i', 'you',
  'it', 'my', 'your', 'this', 'that', 'can', 'what', 'when', 'where', 'how',
  'which', 'who', 'about', 'into', 'from', 'as', 'if', 'me', 'we', 'have',
  'has', 'will', 'would', 'should', 'get', 'need', 'want', 'up', 'out',
]);

/** Lowercased, punctuation-stripped words, stopwords and short tokens dropped. */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 3 && !STOPWORDS.has(word));
}

function fromFaq(idPrefix: string, entry: FaqEntry, extraKeywords?: string[]): ChatEntry {
  return {
    id: `${idPrefix}-${tokenize(entry.question).slice(0, 3).join('-')}`,
    prompt: entry.question,
    answer: entry.answer,
    extraKeywords,
  };
}

/** The "Good to know" and package accordions, plus site-navigation questions. */
export const chatKnowledge: ChatEntry[] = [
  ...faqs.map((entry) => fromFaq('faq', entry)),
  ...packageFaqs.map((entry) => fromFaq('pkg', entry, ['bundle', 'bundled'])),
  {
    id: 'book-tour',
    prompt: 'How do I book a tour?',
    answer:
      "Open a tour's page and send a request with your dates and party size. Nothing is charged there — a local coordinator confirms availability and shares payment details directly.",
  },
  {
    id: 'book-car',
    prompt: 'How do I rent a car?',
    answer:
      'Search by pick-up city and dates on the Cars page, then send a request for the one you want. It works the same as tours: a request, not an instant charge.',
    extraKeywords: ['rental', 'rent', 'vehicle', 'drive'],
    link: { href: '/cars', label: 'Browse cars' },
  },
  {
    id: 'book-cruise',
    prompt: 'How do I book a cruise?',
    answer:
      'Cruises are searched by departure port and dates on the Cruises page. Send a request for the sailing you like and a coordinator confirms your cabin and price.',
    extraKeywords: ['sailing', 'ship', 'boat'],
    link: { href: '/cruises', label: 'Browse cruises' },
  },
  {
    id: 'book-flight',
    prompt: 'How do I book a flight?',
    answer:
      'Search flights by route and dates on the Flights page. Requesting one sends your details to a coordinator rather than charging a card on the spot.',
    extraKeywords: ['plane', 'airline', 'ticket'],
    link: { href: '/flights', label: 'Browse flights' },
  },
  {
    id: 'contact-human',
    prompt: 'I want to talk to a person',
    answer: `Happy to connect you — write to ${CONTACT_EMAIL} and a coordinator will pick it up.`,
    extraKeywords: ['human', 'person', 'agent', 'support', 'email', 'help', 'contact', 'talk', 'speak'],
    link: { href: `mailto:${CONTACT_EMAIL}`, label: `Email ${CONTACT_EMAIL}` },
  },
  {
    id: 'favorites',
    prompt: 'How do saved destinations work?',
    answer:
      'Tap the heart on any destination or listing to save it — saved items stay starred as you browse, so you can come back and compare before you request anything.',
    extraKeywords: ['save', 'saved', 'heart', 'favorite', 'favourite', 'wishlist'],
  },
  {
    id: 'packages-page',
    prompt: 'Where can I see package deals?',
    answer:
      'The Packages page bundles a round-trip flight and hotel into one request, with the biggest combined savings.',
    extraKeywords: ['deal', 'deals', 'bundle'],
    link: { href: '/packages', label: 'See packages' },
  },
  {
    id: 'things-to-do',
    prompt: 'What tours and activities do you offer?',
    answer:
      'Things to Do lists guided tours and activities by destination — temples, islands, cooking classes, and more — each bookable with a request.',
    extraKeywords: ['activity', 'activities', 'excursion', 'excursions'],
    link: { href: '/things-to-do', label: 'See things to do' },
  },
];

export const suggestedPrompts: string[] = [
  'Do I need a visa to visit Thailand?',
  "What's the best time of year to go?",
  'How do I book a tour?',
  'I want to talk to a person',
];

/*
 * A word's weight depends on where it comes from: the prompt and any
 * explicit extra keywords name what the question is *about*, while the
 * answer is supporting detail that happens to share ordinary words with
 * other entries (e.g. "book", "car" both turn up incidentally in the
 * package-and-a-rental-car answer). Weighting prompt/extra matches higher
 * keeps an entry from outscoring a more specific one on incidental overlap.
 */
const PROMPT_WEIGHT = 3;
const ANSWER_WEIGHT = 1;

function weightedKeywords(entry: ChatEntry): Map<string, number> {
  const weights = new Map<string, number>();
  const add = (word: string, weight: number) => {
    weights.set(word, Math.max(weights.get(word) ?? 0, weight));
  };
  for (const word of tokenize(entry.prompt)) add(word, PROMPT_WEIGHT);
  for (const word of entry.extraKeywords ?? []) add(word.toLowerCase(), PROMPT_WEIGHT);
  for (const word of tokenize(entry.answer)) add(word, ANSWER_WEIGHT);
  return weights;
}

/** Best keyword match for a visitor's message, or null if nothing scores. */
export function findAnswer(input: string): ChatEntry | null {
  const words = tokenize(input);
  if (words.length === 0) return null;

  let best: ChatEntry | null = null;
  let bestScore = 0;

  for (const entry of chatKnowledge) {
    const entryWeights = weightedKeywords(entry);
    const score = words.reduce((total, word) => total + (entryWeights.get(word) ?? 0), 0);
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  }

  return best;
}
