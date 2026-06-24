(function () {
  "use strict";

  var body = document.body;
  var header = document.querySelector("[data-header]");
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-menu]");
  var dropdownButtons = document.querySelectorAll("[data-dropdown-toggle]");

  function closeDropdowns(exceptId) {
    dropdownButtons.forEach(function (button) {
      var id = button.getAttribute("data-dropdown-toggle");
      var panel = id ? document.getElementById(id) : null;
      if (!panel || id === exceptId) return;
      panel.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    });
  }

  function closeMenu() {
    if (!menu || !menuToggle) return;
    menu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  }

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    menu.addEventListener("click", function (event) {
      if (event.target.matches("a")) {
        closeMenu();
        closeDropdowns();
      }
    });
  }

  dropdownButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      var id = button.getAttribute("data-dropdown-toggle");
      var panel = id ? document.getElementById(id) : null;
      if (!panel) return;

      var willOpen = !panel.classList.contains("is-open");
      closeDropdowns(id);
      panel.classList.toggle("is-open", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
    });
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".has-dropdown")) closeDropdowns();
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      var target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      var headerHeight = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;
      window.scrollTo({ top: top, behavior: "smooth" });
      closeMenu();
      closeDropdowns();
    });
  });

  var carousel = document.querySelector("[data-carousel]");
  var carouselTrack = document.querySelector("[data-carousel-track]");
  var carouselPrev = document.querySelector("[data-carousel-prev]");
  var carouselNext = document.querySelector("[data-carousel-next]");
  var carouselTransitioning = false;
  var carouselAnimationFrame = null;
  var carouselDrag = {
    active: false,
    dragged: false,
    pointerId: null,
    startX: 0,
    startScrollLeft: 0,
    threshold: 10
  };

  function getCarouselStep() {
    if (!carouselTrack) return 320;
    var firstCard = carouselTrack.querySelector(".collection-card");
    if (!firstCard) return 320;
    var styles = window.getComputedStyle(carouselTrack);
    var gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return firstCard.getBoundingClientRect().width + gap;
  }

  function getCarouselLoopPoint() {
    if (!carouselTrack) return 0;
    var cards = carouselTrack.querySelectorAll(".collection-card");
    if (cards.length < 2) return 0;
    var duplicateStart = Math.floor(cards.length / 2);
    return cards[duplicateStart].offsetLeft - cards[0].offsetLeft;
  }

  function normalizeCarouselPosition() {
    if (!carousel || !carouselTrack) return;
    var loopPoint = getCarouselLoopPoint();
    if (!loopPoint) return;

    if (carousel.scrollLeft >= loopPoint) {
      carousel.scrollLeft = carousel.scrollLeft - loopPoint;
    } else if (carousel.scrollLeft < 0) {
      carousel.scrollLeft = carousel.scrollLeft + loopPoint;
    }
  }

  function moveCarousel(direction) {
    if (!carousel || !carouselTrack || carouselTransitioning) return;

    var step = getCarouselStep();
    var loopPoint = getCarouselLoopPoint();

    if (direction < 0 && carousel.scrollLeft <= 4 && loopPoint) {
      carousel.scrollLeft = carousel.scrollLeft + loopPoint;
    }

    var startPosition = carousel.scrollLeft;
    var targetPosition = startPosition + (direction * step);
    var startTime = null;
    var duration = 650;
    var directionClass = direction > 0 ? "is-moving-next" : "is-moving-prev";

    carouselTransitioning = true;
    carousel.classList.add("is-transitioning", directionClass);

    function animateCarousel(timestamp) {
      if (startTime === null) startTime = timestamp;

      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easedProgress = 1 - Math.pow(1 - progress, 4);
      carousel.scrollLeft = startPosition + ((targetPosition - startPosition) * easedProgress);

      if (progress < 1) {
        carouselAnimationFrame = window.requestAnimationFrame(animateCarousel);
        return;
      }

      carousel.scrollLeft = targetPosition;
      normalizeCarouselPosition();
      carousel.classList.remove("is-transitioning", directionClass);
      carouselTransitioning = false;
      carouselAnimationFrame = null;
    }

    carouselAnimationFrame = window.requestAnimationFrame(animateCarousel);
  }

  if (carousel && carouselTrack) {
    carousel.addEventListener("scroll", function () {
      if (carouselDrag.active || carouselTransitioning) return;
      window.requestAnimationFrame(normalizeCarouselPosition);
    });

    carousel.addEventListener("pointerdown", function (event) {
      if (carouselTransitioning) return;
      if (event.button !== undefined && event.button !== 0) return;
      carouselDrag.active = true;
      carouselDrag.dragged = false;
      carouselDrag.pointerId = event.pointerId;
      carouselDrag.startX = event.clientX;
      carouselDrag.startScrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener("pointermove", function (event) {
      if (!carouselDrag.active) return;
      var delta = event.clientX - carouselDrag.startX;
      if (!carouselDrag.dragged && Math.abs(delta) < carouselDrag.threshold) return;

      if (!carouselDrag.dragged) {
        carouselDrag.dragged = true;
        carousel.classList.add("is-dragging");
        carousel.setPointerCapture(carouselDrag.pointerId);
      }

      event.preventDefault();
      carousel.scrollLeft = carouselDrag.startScrollLeft - delta;

      var loopPoint = getCarouselLoopPoint();
      if (!loopPoint) return;
      if (carousel.scrollLeft >= loopPoint) {
        carousel.scrollLeft = carousel.scrollLeft - loopPoint;
        carouselDrag.startScrollLeft = carouselDrag.startScrollLeft - loopPoint;
      } else if (carousel.scrollLeft <= 0) {
        carousel.scrollLeft = carousel.scrollLeft + loopPoint;
        carouselDrag.startScrollLeft = carouselDrag.startScrollLeft + loopPoint;
      }
    });

    carousel.addEventListener("pointerup", function (event) {
      if (!carouselDrag.active) return;
      carouselDrag.active = false;
      carousel.classList.remove("is-dragging");
      if (carousel.hasPointerCapture(event.pointerId)) {
        carousel.releasePointerCapture(event.pointerId);
      }
      carouselDrag.pointerId = null;
      normalizeCarouselPosition();
    });

    carousel.addEventListener("pointercancel", function () {
      carouselDrag.active = false;
      carouselDrag.pointerId = null;
      carousel.classList.remove("is-dragging");
      normalizeCarouselPosition();
    });

    carousel.addEventListener("click", function (event) {
      if (!carouselDrag.dragged) return;
      event.preventDefault();
      event.stopPropagation();
      carouselDrag.dragged = false;
    }, true);
  }

  if (carouselPrev) {
    carouselPrev.addEventListener("click", function () {
      moveCarousel(-1);
    });
  }

  if (carouselNext) {
    carouselNext.addEventListener("click", function () {
      moveCarousel(1);
    });
  }

  var lightbox = document.querySelector("[data-lightbox]");
  var lightboxImage = document.querySelector("[data-lightbox-image]");
  var lightboxTitle = document.querySelector("[data-lightbox-title]");
  var lightboxCaption = document.querySelector("[data-lightbox-caption]");
  var lightboxClose = document.querySelector("[data-lightbox-close]");
  var lastFocusedElement = null;

  function openLightbox(trigger) {
    if (!lightbox || !lightboxImage) return;
    lastFocusedElement = document.activeElement;

    var fullImage = trigger.getAttribute("data-full");
    var title = trigger.getAttribute("data-title") || "Artwork preview";
    var caption = trigger.getAttribute("data-caption") || "";

    lightboxImage.src = fullImage || "";
    lightboxImage.alt = title;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCaption) lightboxCaption.textContent = caption;

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    body.classList.add("lightbox-open");
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    body.classList.remove("lightbox-open");
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  document.querySelectorAll(".gallery-trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      openLightbox(trigger);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeDropdowns();
      closeMenu();
      closeLightbox();
    }
  });

  var newsletterForm = document.querySelector("[data-newsletter-form]");
  var newsletterMessage = document.querySelector("[data-newsletter-message]");

  if (newsletterForm && newsletterMessage) {
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();
      newsletterMessage.textContent = "Thank you. Newsletter signup will be connected before launch.";
      newsletterForm.reset();
    });
  }

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  var revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }
})();
