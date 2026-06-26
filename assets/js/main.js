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
  var carouselTrack = carousel ? carousel.querySelector(".swiper-wrapper") : null;
  var carouselPrev = document.querySelector("[data-carousel-prev]");
  var carouselNext = document.querySelector("[data-carousel-next]");

  if (carousel && carouselTrack && typeof window.Swiper === "function") {
    var originalCarouselSlides = Array.prototype.slice.call(carouselTrack.querySelectorAll(".swiper-slide"));
    var carouselSlideCount = originalCarouselSlides.length;
    var carouselMiddleSet = 2;

    if (carouselSlideCount > 0) {
      carouselTrack.innerHTML = "";

      for (var setIndex = 0; setIndex < 5; setIndex += 1) {
        originalCarouselSlides.forEach(function (slide, slideIndex) {
          var clone = slide.cloneNode(true);
          clone.setAttribute("data-carousel-slide", String(slideIndex));

          if (setIndex !== carouselMiddleSet) {
            clone.setAttribute("aria-hidden", "true");
            clone.setAttribute("tabindex", "-1");
          }

          carouselTrack.appendChild(clone);
        });
      }
    }

    var carouselSwiper = new window.Swiper(carousel, {
      initialSlide: carouselSlideCount * carouselMiddleSet,
      speed: 700,
      slidesPerView: "auto",
      spaceBetween: 24,
      grabCursor: true,
      watchOverflow: false,
      rewind: false,
      keyboard: {
        enabled: true,
        onlyInViewport: true
      },
      a11y: {
        containerMessage: "Selected works carousel",
        prevSlideMessage: "Previous collection",
        nextSlideMessage: "Next collection"
      },
      breakpoints: {
        0: {
          spaceBetween: 16
        },
        641: {
          spaceBetween: 24
        }
      }
    });

    function normalizeCarouselLoop() {
      if (!carouselSlideCount) return;

      var activeIndex = carouselSwiper.activeIndex;
      var firstStableSlide = carouselSlideCount * carouselMiddleSet;
      var lastStableSlide = firstStableSlide + carouselSlideCount - 1;

      if (activeIndex >= firstStableSlide && activeIndex <= lastStableSlide) return;

      var normalizedOffset = activeIndex % carouselSlideCount;
      if (normalizedOffset < 0) normalizedOffset += carouselSlideCount;
      carouselSwiper.slideTo(firstStableSlide + normalizedOffset, 0, false);
    }

    carouselSwiper.on("slideChangeTransitionEnd", normalizeCarouselLoop);
    carouselSwiper.on("touchEnd", function () {
      window.setTimeout(normalizeCarouselLoop, carouselSwiper.params.speed + 20);
    });

    carousel.setAttribute("data-carousel-ready", "true");
    carousel.swiperInstance = carouselSwiper;

    if (carouselPrev) {
      carouselPrev.addEventListener("click", function () {
        carouselSwiper.slidePrev();
      });
    }

    if (carouselNext) {
      carouselNext.addEventListener("click", function () {
        carouselSwiper.slideNext();
      });
    }
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
