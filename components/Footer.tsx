export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <a className="brand" href="#top">
            AMARA <span>·</span> SIAM
          </a>
          <p>Curated Thailand journeys, booked simply.</p>
        </div>
        <div className="footer-col">
          <h4>Explore</h4>
          <a href="#destinations">Destinations</a>
          <a href="#tours">Tours</a>
          <a href="#faq">Good to Know</a>
          <a href="#contact">Contact Us</a>
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
