(function () {
  "use strict";

  var body = document.body;
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-menu]");
  var header = document.querySelector("[data-header]");

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
      if (event.target.matches("a")) closeMenu();
    });
  }

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
    });
  });

  var filterButtons = document.querySelectorAll("[data-filter]");
  var galleryItems = document.querySelectorAll(".gallery-item");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.getAttribute("data-filter");

      filterButtons.forEach(function (item) {
        item.classList.toggle("is-active", item === button);
      });

      galleryItems.forEach(function (item) {
        var category = item.getAttribute("data-category");
        item.classList.toggle("is-hidden", filter !== "all" && category !== filter);
      });
    });
  });

  var lightbox = document.querySelector("[data-lightbox]");
  var lightboxImage = document.querySelector("[data-lightbox-image]");
  var lightboxPlaceholder = document.querySelector("[data-lightbox-placeholder]");
  var lightboxTitle = document.querySelector("[data-lightbox-title]");
  var lightboxCaption = document.querySelector("[data-lightbox-caption]");
  var lightboxClose = document.querySelector("[data-lightbox-close]");
  var lastFocusedElement = null;

  function openLightbox(trigger) {
    if (!lightbox) return;
    lastFocusedElement = document.activeElement;

    var fullImage = trigger.getAttribute("data-full");
    var title = trigger.getAttribute("data-title") || "Artwork preview";
    var caption = trigger.getAttribute("data-caption") || "";

    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCaption) lightboxCaption.textContent = caption;

    if (fullImage && lightboxImage) {
      lightboxImage.src = fullImage;
      lightboxImage.alt = title;
      lightboxImage.hidden = false;
      if (lightboxPlaceholder) {
        lightboxPlaceholder.classList.remove("is-visible", "placeholder-trigger");
        lightboxPlaceholder.textContent = "";
      }
    } else {
      if (lightboxImage) {
        lightboxImage.removeAttribute("src");
        lightboxImage.hidden = true;
      }
      if (lightboxPlaceholder) {
        lightboxPlaceholder.className = "lightbox-placeholder is-visible placeholder-trigger";
        lightboxPlaceholder.textContent = "IMAGE PLACEHOLDER - ARTWORK";
      }
    }

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
      closeMenu();
      closeLightbox();
    }
  });

  var contactForm = document.querySelector("[data-contact-form]");
  var contactMessage = document.querySelector("[data-contact-message]");

  if (contactForm && contactMessage) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      contactMessage.textContent = "Thank you. Please email jade@example.com until the form is connected.";
      contactForm.reset();
    });
  }

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
