'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { ChevronDownIcon } from './icons';

export type LinkGroup = {
  title: string;
  links: { href: string; label: string }[];
};

/** One collapsible group: a ruled header and a four-column grid of links. */
function Group({ group }: { group: LinkGroup }) {
  const [open, setOpen] = useState(true);
  const listId = useId();

  return (
    <div className={`lp-links-group${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="lp-links-head"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{group.title}</span>
        <ChevronDownIcon />
      </button>
      <ul className="lp-links-list" id={listId}>
        {group.links.map((link) => (
          <li key={link.href + link.label}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The two link blocks the reference closes the page with. */
export default function PackagesLinkGroups({ groups }: { groups: LinkGroup[] }) {
  return (
    <section className="lp-links">
      {groups.map((group) => (
        <Group key={group.title} group={group} />
      ))}
    </section>
  );
}
