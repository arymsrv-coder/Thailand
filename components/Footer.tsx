import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link className="brand" href="/#top">
            <Image
              className="brand-mark"
              src="/brand/amara-siam-mark-light.png"
              alt=""
              width={970}
              height={992}
            />
            <span className="brand-word">
              AMARA <span>·</span> SIAM
            </span>
          </Link>
          <p>Curated Thailand journeys, booked simply.</p>
        </div>
        <div className="footer-col">
          <h4>Explore</h4>
          <Link href="/#destinations">Destinations</Link>
          <Link href="/things-to-do">Things to do</Link>
          <Link href="/#faq">Good to Know</Link>
          <Link href="/#contact">Contact Us</Link>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <a href="mailto:hello@amarasiam.com">hello@amarasiam.com</a>
          <a href="tel:+6621234567">+66 2 123 4567</a>
          <a href="https://instagram.com/amarasiam" target="_blank" rel="noopener">
            Instagram
          </a>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© 2026 Amara Siam. A demo travel booking layout.</p>
      </div>
    </footer>
  );
}
