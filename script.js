document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("js-enabled");

  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");
  const revealElements = document.querySelectorAll(".reveal");
  const counters = document.querySelectorAll(".counter");
  const backToTop = document.querySelector(".back-to-top");
  const year = document.getElementById("year");
  const sections = document.querySelectorAll("main section[id]");

  /* =========================================================
     CURRENT YEAR
  ========================================================= */

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const closeMenu = () => {
    if (!menuToggle || !mainNav) return;

    menuToggle.classList.remove("open");
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");

      menuToggle.classList.toggle("open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      const clickedInsideMenu =
        mainNav.contains(event.target) ||
        menuToggle.contains(event.target);

      if (!clickedInsideMenu && mainNav.classList.contains("open")) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  /* =========================================================
     HEADER SCROLL EFFECT
  ========================================================= */

  const updateHeader = () => {
    if (!header) return;

    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* =========================================================
     BACK TO TOP BUTTON
  ========================================================= */

  const updateBackToTop = () => {
    if (!backToTop) return;

    if (window.scrollY > 500) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  };

  updateBackToTop();
  window.addEventListener("scroll", updateBackToTop, { passive: true });

  /* =========================================================
     SCROLL REVEAL ANIMATIONS
  ========================================================= */

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* =========================================================
     ANIMATED COUNTERS
  ========================================================= */

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target);

    if (!Number.isFinite(target)) return;

    let current = 0;
    const duration = 1200;
    const startTime = performance.now();

    const updateCounter = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      current = Math.floor(target * easedProgress);
      counter.textContent = String(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = String(target);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.5,
      }
    );

    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  } else {
    counters.forEach(animateCounter);
  }

  /* =========================================================
     ACTIVE NAVIGATION LINK
  ========================================================= */

  const navSectionLinks = Array.from(
    document.querySelectorAll('.main-nav a[href^="#"]')
  );

  const setActiveLink = () => {
    let currentSectionId = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 160;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionBottom
      ) {
        currentSectionId = section.id;
      }
    });

    navSectionLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const matchesCurrentSection = href === `#${currentSectionId}`;

      link.classList.toggle("active", matchesCurrentSection);
    });
  };

  setActiveLink();
  window.addEventListener("scroll", setActiveLink, { passive: true });

  /* =========================================================
     SMOOTH INTERNAL LINK SCROLLING
  ========================================================= */

  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (!targetElement) return;

      event.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition =
        targetElement.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });

  /* =========================================================
     HERO CARD MOUSE MOVEMENT
  ========================================================= */

  const heroCard = document.querySelector(".hero-card");

  if (
    heroCard &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    heroCard.addEventListener("mousemove", (event) => {
      const rect = heroCard.getBoundingClientRect();

      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((mouseY - centerY) / centerY) * -4;
      const rotateY = ((mouseX - centerX) / centerX) * 4;

      heroCard.style.transform =
        `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroCard.addEventListener("mouseleave", () => {
      heroCard.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg)";
    });
  }

  /* =========================================================
     CLOSE MOBILE MENU AFTER SCREEN RESIZE
  ========================================================= */

  /* =========================================================
   PRELOADER
========================================================= */

(function () {
  const hidePreloader = () => {
    const preloader = document.getElementById("preloader");

    if (!preloader) {
      return;
    }

    preloader.classList.add("hide");

    setTimeout(() => {
      preloader.remove();
    }, 900);
  };

  if (document.readyState === "complete") {
    setTimeout(hidePreloader, 1600);
  } else {
    window.addEventListener(
      "load",
      () => {
        setTimeout(hidePreloader, 1600);
      },
      { once: true }
    );
  }

  /*
    Emergency fallback:
    The loader will always disappear after four seconds,
    even if another script encounters an error.
  */

  setTimeout(hidePreloader, 4000);
})();
