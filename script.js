document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("js-enabled");

  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");
  const revealElements = document.querySelectorAll(".reveal");
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

    header.classList.toggle("scrolled", window.scrollY > 40);
  };

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  /* =========================================================
     BACK TO TOP BUTTON
  ========================================================= */

  const updateBackToTop = () => {
    if (!backToTop) return;

    backToTop.classList.toggle("visible", window.scrollY > 500);
  };

  updateBackToTop();

  window.addEventListener("scroll", updateBackToTop, {
    passive: true
  });

  /* =========================================================
     SCROLL REVEAL
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
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
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

  const counterElements = document.querySelectorAll(".counter");

  const animateCounter = (counter) => {
    if (counter.dataset.animated === "true") return;

    const target = Number(counter.dataset.target);

    if (!Number.isFinite(target)) {
      counter.textContent = "0";
      return;
    }

    counter.dataset.animated = "true";

    const duration = 1400;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      counter.textContent = Math.floor(
        target * easedProgress
      );

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    };

    requestAnimationFrame(update);
  };

  if (counterElements.length > 0) {
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
          threshold: 0.25,
          rootMargin: "0px"
        }
      );

      counterElements.forEach((counter) => {
        counterObserver.observe(counter);
      });
    } else {
      counterElements.forEach((counter) => {
        animateCounter(counter);
      });
    }

    /*
      Fallback in case the observer fails.
      The counters will still animate after 2 seconds.
    */

    setTimeout(() => {
      counterElements.forEach((counter) => {
        animateCounter(counter);
      });
    }, 2000);
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
      const sectionTop = section.offsetTop - 170;
      const sectionBottom =
        sectionTop + section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionBottom
      ) {
        currentSectionId = section.id;
      }
    });

    navSectionLinks.forEach((link) => {
      const href = link.getAttribute("href");

      link.classList.toggle(
        "active",
        href === `#${currentSectionId}`
      );
    });
  };

  setActiveLink();

  window.addEventListener("scroll", setActiveLink, {
    passive: true
  });

  /* =========================================================
     SMOOTH INTERNAL SCROLLING
  ========================================================= */

  const internalLinks =
    document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetElement =
        document.querySelector(targetId);

      if (!targetElement) return;

      event.preventDefault();

      const headerHeight =
        header ? header.offsetHeight : 0;

      const targetPosition =
        targetElement.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    });
  });

  /* =========================================================
     HERO CARD MOVEMENT
  ========================================================= */

  const heroCard = document.querySelector(".hero-card");

  if (
    heroCard &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {
    heroCard.addEventListener("mousemove", (event) => {
      const rect = heroCard.getBoundingClientRect();

      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX =
        ((mouseY - centerY) / centerY) * -4;

      const rotateY =
        ((mouseX - centerX) / centerX) * 4;

      heroCard.style.transform =
        `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroCard.addEventListener("mouseleave", () => {
      heroCard.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg)";
    });
  }

  /* =========================================================
     RESIZE HANDLING
  ========================================================= */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 950) {
      closeMenu();
    }
  });
});