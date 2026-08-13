(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------------------
     Navbar: solid background once the page has scrolled a little,
     plus the mobile menu toggle.
  ----------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navMobile = document.getElementById('navMobile');

  function updateNavbarState() {
    navbar.classList.toggle('is-solid', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateNavbarState, { passive: true });
  updateNavbarState();

  menuToggle.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navMobile.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMobile.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* -----------------------------------------------------------------
     Hero: once the user scrolls past a small threshold, the video
     crossfades into a static image in place (fixed-height banner,
     no resizing). Scrolling back up brings the video back.
  ----------------------------------------------------------------- */
  const heroMedia = document.getElementById('heroMedia');
  const heroVideo = document.getElementById('heroVideo');

  const HERO_SWITCH_AT = 120;
  let videoIsPlaying = true;
  let heroTicking = false;

  function applyHeroState() {
    const shouldBeStatic = window.scrollY > HERO_SWITCH_AT;
    heroMedia.classList.toggle('is-static', shouldBeStatic);

    if (shouldBeStatic && videoIsPlaying) {
      heroVideo.pause();
      videoIsPlaying = false;
    } else if (!shouldBeStatic && !videoIsPlaying) {
      heroVideo.play().catch(() => {});
      videoIsPlaying = true;
    }
  }

  function onHeroScroll() {
    if (heroTicking) return;
    heroTicking = true;
    requestAnimationFrame(() => {
      applyHeroState();
      heroTicking = false;
    });
  }

  if (prefersReducedMotion) {
    heroVideo.style.display = 'none';
    document.getElementById('heroImage').style.opacity = '1';
  } else {
    window.addEventListener('scroll', onHeroScroll, { passive: true });
    onHeroScroll();
  }

  /* -----------------------------------------------------------------
     Hero search bar — visual only, no backend. Search scrolls down
     to the destinations feed; the guest stepper adjusts a count.
  ----------------------------------------------------------------- */
  const heroSearch = document.getElementById('heroSearch');
  const guestCount = document.getElementById('guestCount');
  let guests = 2;

  heroSearch.querySelectorAll('.guest-stepper button').forEach((button) => {
    button.addEventListener('click', () => {
      const step = Number(button.dataset.step);
      guests = Math.min(12, Math.max(1, guests + step));
      guestCount.textContent = String(guests);
    });
  });

  heroSearch.addEventListener('submit', (event) => {
    event.preventDefault();
    document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
  });

  /* -----------------------------------------------------------------
     Destination listing cards — photo dots switch the image,
     heart button toggles a save state. Both visual only.
  ----------------------------------------------------------------- */
  document.querySelectorAll('.listing-card').forEach((card) => {
    const images = JSON.parse(card.dataset.images);
    const img = card.querySelector('.listing-media img');
    const dots = card.querySelectorAll('.listing-dots button');

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        img.src = images[index];
        dots.forEach((d) => d.classList.remove('is-active'));
        dot.classList.add('is-active');
      });
    });

    card.querySelector('.listing-heart').addEventListener('click', (event) => {
      event.currentTarget.classList.toggle('is-saved');
    });
  });

  /* -----------------------------------------------------------------
     FAQ accordion.
  ----------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      faqItems.forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* -----------------------------------------------------------------
     Booking modal — front-end only, no backend submission.
  ----------------------------------------------------------------- */
  const modal = document.getElementById('bookingModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalMeta = document.getElementById('modalMeta');
  const modalPrice = document.getElementById('modalPrice');
  const bookingForm = document.getElementById('bookingForm');
  const modalSuccess = document.getElementById('modalSuccess');
  const modalCloseSuccess = document.getElementById('modalCloseSuccess');

  let lastFocusedElement = null;

  function openModal(card) {
    lastFocusedElement = document.activeElement;

    modalImage.src = card.dataset.image;
    modalImage.alt = card.dataset.title;
    modalTitle.textContent = card.dataset.title;
    modalMeta.textContent = `${card.dataset.location} · ${card.dataset.duration}`;
    modalPrice.textContent = `${card.dataset.price} / person`;

    bookingForm.reset();
    bookingForm.hidden = false;
    modalSuccess.hidden = true;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close').focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  document.querySelectorAll('.btn-book').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.tour-card');
      openModal(card);
    });
  });

  modal.querySelectorAll('[data-close]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    bookingForm.hidden = true;
    modalSuccess.hidden = false;
  });

  modalCloseSuccess.addEventListener('click', closeModal);
})();
