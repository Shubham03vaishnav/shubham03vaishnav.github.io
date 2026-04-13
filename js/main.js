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

  // --- Interactive Background Elements ---
  const canvas = document.createElement('canvas');
  canvas.id = 'interactive-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width, height;
  let elements = [];

  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let targetMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  
  window.addEventListener('mousemove', (e) => {
    targetMouse.x = e.clientX;
    targetMouse.y = e.clientY;
  });

  class BackgroundElement {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.baseX = this.x;
      this.baseY = this.y;
      this.size = Math.random() * 2 + 0.5;
      this.parallaxFactor = (Math.random() * 0.8 + 0.2); 
      this.type = Math.random() > 0.8 ? 1 : 0; 
      this.color = 'rgba(255, 255, 255, ' + (Math.random() * 0.2 + 0.1) + ')';
      
      this.driftX = Math.random() * 1000;
      this.driftY = Math.random() * 1000;
      this.driftSpeed = Math.random() * 0.0005 + 0.0002;
    }
    
    draw() {
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
      
      if (this.type === 0) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(this.x - this.size, this.y);
        ctx.lineTo(this.x + this.size, this.y);
        ctx.moveTo(this.x, this.y - this.size);
        ctx.lineTo(this.x, this.y + this.size);
        ctx.stroke();
      }
    }
    
    update(time) {
      const driftOffsetX = Math.sin(time * this.driftSpeed + this.driftX) * 20;
      const driftOffsetY = Math.cos(time * this.driftSpeed + this.driftY) * 20;
      
      const offsetX = (mouse.x - width / 2) * this.parallaxFactor * 0.1;
      const offsetY = (mouse.y - height / 2) * this.parallaxFactor * 0.1;
      
      let targetX = this.baseX + driftOffsetX + offsetX;
      let targetY = this.baseY + driftOffsetY + offsetY;

      // Magnetic attraction to mouse
      const dx = mouse.x - targetX;
      const dy = mouse.y - targetY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        const force = (150 - distance) / 150;
        targetX += dx * force * 0.2;
        targetY += dy * force * 0.2;
      }

      this.x = targetX;
      this.y = targetY;

      this.draw();
    }
  }

  function initElements() {
    elements = [];
    const count = Math.floor((width * height) / 10000); 
    for (let i = 0; i < count; i++) {
      elements.push(new BackgroundElement());
    }
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initElements();
  }
  window.addEventListener('resize', resize);
  resize();

  function animateElements(time) {
    ctx.clearRect(0, 0, width, height);
    
    mouse.x += (targetMouse.x - mouse.x) * 0.06;
    mouse.y += (targetMouse.y - mouse.y) * 0.06;

    for (let i = 0; i < elements.length; i++) {
      elements[i].update(time || 0);
    }
    requestAnimationFrame(animateElements);
  }

  requestAnimationFrame(animateElements);

});
