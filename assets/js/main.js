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

  var projectCarousels = document.querySelectorAll("[data-project-carousel]");

  if (projectCarousels.length && typeof window.Swiper === "function") {
    projectCarousels.forEach(function (projectCarousel) {
      var carouselShell = projectCarousel.closest("[data-project-carousel-shell]");
      var projectTrack = projectCarousel.querySelector(".swiper-wrapper");
      var projectPrev = carouselShell ? carouselShell.querySelector("[data-project-prev]") : null;
      var projectNext = carouselShell ? carouselShell.querySelector("[data-project-next]") : null;
      var projectPagination = projectCarousel.querySelector(".swiper-pagination");
      var originalProjectSlides = projectTrack ? Array.prototype.slice.call(projectTrack.querySelectorAll(".swiper-slide")) : [];
      var projectSlideCount = originalProjectSlides.length;
      var projectMiddleSet = 2;

      if (projectTrack && projectSlideCount > 1) {
        projectTrack.innerHTML = "";

        for (var projectSetIndex = 0; projectSetIndex < 5; projectSetIndex += 1) {
          originalProjectSlides.forEach(function (slide, slideIndex) {
            var clone = slide.cloneNode(true);
            clone.setAttribute("data-project-slide", String(slideIndex));

            if (projectSetIndex !== projectMiddleSet) {
              clone.setAttribute("aria-hidden", "true");
              clone.setAttribute("tabindex", "-1");
            }

            projectTrack.appendChild(clone);
          });
        }
      }

      var projectSwiper = new window.Swiper(projectCarousel, {
        initialSlide: projectSlideCount > 1 ? projectSlideCount * projectMiddleSet : 0,
        loop: false,
        rewind: false,
        watchOverflow: false,
        speed: 700,
        slidesPerView: 1,
        spaceBetween: 16,
        grabCursor: true,
        keyboard: {
          enabled: true,
          onlyInViewport: true
        },
        pagination: false,
        a11y: {
          containerMessage: "Project image carousel",
          prevSlideMessage: "Previous image",
          nextSlideMessage: "Next image"
        }
      });

      projectCarousel.swiperInstance = projectSwiper;

      function getProjectRealIndex() {
        if (!projectSlideCount) return 0;

        var activeSlide = projectSwiper.slides[projectSwiper.activeIndex];
        var slideIndex = activeSlide ? parseInt(activeSlide.getAttribute("data-project-slide"), 10) : NaN;

        if (!Number.isNaN(slideIndex)) return slideIndex;

        var normalizedIndex = projectSwiper.activeIndex % projectSlideCount;
        return normalizedIndex < 0 ? normalizedIndex + projectSlideCount : normalizedIndex;
      }

      function updateProjectPagination() {
        if (!projectPagination || projectSlideCount < 2) return;

        var realIndex = getProjectRealIndex();
        var bullets = projectPagination.querySelectorAll(".swiper-pagination-bullet");

        bullets.forEach(function (bullet, bulletIndex) {
          var isActive = bulletIndex === realIndex;
          bullet.classList.toggle("swiper-pagination-bullet-active", isActive);
          bullet.setAttribute("aria-current", isActive ? "true" : "false");
        });
      }

      function normalizeProjectLoop() {
        if (projectSlideCount < 2) return;

        var activeIndex = projectSwiper.activeIndex;
        var firstStableSlide = projectSlideCount * projectMiddleSet;
        var lastStableSlide = firstStableSlide + projectSlideCount - 1;

        if (activeIndex >= firstStableSlide && activeIndex <= lastStableSlide) {
          updateProjectPagination();
          return;
        }

        var normalizedOffset = activeIndex % projectSlideCount;
        if (normalizedOffset < 0) normalizedOffset += projectSlideCount;
        projectSwiper.slideTo(firstStableSlide + normalizedOffset, 0, false);
        updateProjectPagination();
      }

      function moveProjectCarousel(direction) {
        if (projectSlideCount < 2) return;
        normalizeProjectLoop();

        if (direction < 0) {
          projectSwiper.slidePrev();
        } else {
          projectSwiper.slideNext();
        }
      }

      if (projectPagination && projectSlideCount > 1) {
        projectPagination.innerHTML = "";

        for (var projectBulletIndex = 0; projectBulletIndex < projectSlideCount; projectBulletIndex += 1) {
          var bullet = document.createElement("button");
          bullet.className = "swiper-pagination-bullet";
          bullet.type = "button";
          bullet.setAttribute("aria-label", "Go to project image " + String(projectBulletIndex + 1));

          bullet.addEventListener("click", (function (slideIndex) {
            return function () {
              projectSwiper.slideTo(projectSlideCount * projectMiddleSet + slideIndex);
            };
          })(projectBulletIndex));

          projectPagination.appendChild(bullet);
        }

        updateProjectPagination();
      }

      projectSwiper.on("slideChange", updateProjectPagination);
      projectSwiper.on("slideChangeTransitionEnd", normalizeProjectLoop);
      projectSwiper.on("touchEnd", function () {
        window.setTimeout(normalizeProjectLoop, projectSwiper.params.speed + 20);
      });

      if (projectPrev) {
        projectPrev.addEventListener("click", function () {
          moveProjectCarousel(-1);
        });
      }

      if (projectNext) {
        projectNext.addEventListener("click", function () {
          moveProjectCarousel(1);
        });
      }
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
