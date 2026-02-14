/**
 * Main JavaScript for Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll Reveal Animation ---
  const reveal = () => {
    const reveals = document.querySelectorAll(".reveal");
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    reveals.forEach((revealItem) => {
      const elementTop = revealItem.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        revealItem.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", reveal);
  reveal(); // Trigger once on load

  // --- Navbar Background on Scroll (Mobile Only) ---
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 12, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
      } else {
        navbar.style.background = 'rgba(10, 10, 12, 0.7)';
        navbar.style.boxShadow = 'none';
      }
    });
  }

  // --- Active State for Side Nav & Scroll Spy ---
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".side-icon-box");

  const updateActiveLink = () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      // Add offset for better trigger point
      if (pageYOffset >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") && link.getAttribute("href").includes(current)) {
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", updateActiveLink);
  updateActiveLink(); // Initial check

  // --- Scroll Down Indicator Logic ---
  const scrollDownIndicator = document.querySelector(".scroll-down");
  if (scrollDownIndicator) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        scrollDownIndicator.style.opacity = "0";
        scrollDownIndicator.style.visibility = "hidden";
      } else {
        scrollDownIndicator.style.opacity = "1"; // Or original opacity
        scrollDownIndicator.style.visibility = "visible";
      }
    });
  }

  // --- Back to Top Button Logic ---
  const backToTopBtn = document.getElementById("backToTop");

  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    });

    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // --- Dynamic Year in Footer (Optional but good practice) ---
  const yearSpan = document.querySelector(".copyright-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

});
