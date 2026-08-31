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
     Hero: the video sticks to the top of the screen as the page
     scrolls, staying pinned there until only ~20% of its height is
     still visible (pure CSS, see .hero-media). Once it has scrolled
     fully out of view, the video is paused (and swapped for a static
     poster image) to save resources; scrolling back up brings it
     right back. An IntersectionObserver — rather than a scroll-
     position calculation — is used here so this stays correct no
     matter how the hero's CSS dimensions change.
  ----------------------------------------------------------------- */
  const heroMedia = document.getElementById('heroMedia');
  const heroVideo = document.getElementById('heroVideo');

  let videoIsPlaying = true;

  function setVideoPlaying(shouldPlay) {
    heroMedia.classList.toggle('is-static', !shouldPlay);
    if (shouldPlay && !videoIsPlaying) {
      heroVideo.play().catch(() => {});
      videoIsPlaying = true;
    } else if (!shouldPlay && videoIsPlaying) {
      heroVideo.pause();
      videoIsPlaying = false;
    }
  }

  if (prefersReducedMotion) {
    heroVideo.style.display = 'none';
    document.getElementById('heroImage').style.opacity = '1';
  } else if ('IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver(
      ([entry]) => setVideoPlaying(entry.isIntersecting),
      { threshold: 0 }
    );
    heroObserver.observe(heroMedia);
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
     Destination listing cards — thumbnail dots switch the photo,
     heart button toggles a save state, and clicking the card row
     smoothly expands an accordion-style panel with a full photo
     gallery, an About paragraph, and an address/get-directions card.
     The collapsed thumbnail and the expanded gallery share one photo
     index per card, so switching one keeps the other in sync.
  ----------------------------------------------------------------- */
  document.querySelectorAll('.listing-card').forEach((card) => {
    const images = JSON.parse(card.dataset.images);
    const title = card.querySelector('.listing-info h3').textContent;
    const row = card.querySelector('.listing-row');
    const thumbImg = card.querySelector('.listing-media img');
    const thumbDots = card.querySelector('.listing-dots');
    const galleryImg = card.querySelector('.listing-gallery-img');
    const galleryCounter = card.querySelector('.listing-gallery-counter');
    const mapFrame = card.querySelector('.listing-map-preview iframe');

    let index = 0;

    const dotButtons = images.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Photo ${i + 1}`);
      dot.addEventListener('click', (event) => {
        event.stopPropagation();
        setIndex(i);
      });
      thumbDots.appendChild(dot);
      return dot;
    });

    function setIndex(i) {
      index = (i + images.length) % images.length;
      thumbImg.src = images[index];
      galleryImg.src = images[index];
      galleryImg.alt = `${title} — photo ${index + 1}`;
      galleryCounter.textContent = `${index + 1} / ${images.length}`;
      dotButtons.forEach((d, i2) => d.classList.toggle('is-active', i2 === index));
    }
    setIndex(0);

    card.querySelector('.gallery-prev').addEventListener('click', (event) => {
      event.stopPropagation();
      setIndex(index - 1);
    });
    card.querySelector('.gallery-next').addEventListener('click', (event) => {
      event.stopPropagation();
      setIndex(index + 1);
    });

    card.querySelector('.listing-heart').addEventListener('click', (event) => {
      event.stopPropagation();
      event.currentTarget.classList.toggle('is-saved');
    });

    row.addEventListener('click', () => {
      const isExpanded = card.classList.toggle('is-expanded');
      if (isExpanded && mapFrame && !mapFrame.src) {
        mapFrame.src = mapFrame.dataset.src;
      }
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
