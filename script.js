// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu functionality
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  mobileMenuBtn.addEventListener("click", function () {
    mobileMenu.classList.toggle("hidden");

    // Toggle icon between hamburger and X
    const icon = mobileMenuBtn.querySelector("i");
    if (mobileMenu.classList.contains("hidden")) {
      icon.className = "fas fa-bars";
    } else {
      icon.className = "fas fa-times";
    }
  });

  // Close mobile menu when clicking on a link
  const mobileMenuLinks = mobileMenu.querySelectorAll("a");
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenu.classList.add("hidden");
      const icon = mobileMenuBtn.querySelector("i");
      icon.className = "fas fa-bars";
    });
  });

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerOffset = 80; // Account for fixed header
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Active navigation link highlighting
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      const sectionHeight = section.offsetHeight;

      if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("text-blue-400");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("text-blue-400");
      }
    });
  }

  // Update active nav link on scroll
  window.addEventListener("scroll", updateActiveNavLink);

  // Navbar background change on scroll
  const navbar = document.querySelector("nav");
  function updateNavbarBackground() {
    if (window.scrollY > 50) {
      navbar.classList.add("bg-gray-900");
      navbar.classList.remove("bg-gray-900/95");
    } else {
      navbar.classList.remove("bg-gray-900");
      navbar.classList.add("bg-gray-900/95");
    }
  }

  window.addEventListener("scroll", updateNavbarBackground);

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-slide-up");
        entry.target.style.opacity = "1";
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    ".bg-gray-800\\/50, .bg-gray-800"
  );
  animateElements.forEach((el) => {
    el.style.opacity = "0";
    observer.observe(el);
  });

  // Typing effect for the hero section
  function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = "";

    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  // Skills progress animation
  function animateSkillBars() {
    const skillBars = document.querySelectorAll(
      "#skills .bg-yellow-400, #skills .bg-blue-400, #skills .bg-white, #skills .bg-green-400, #skills .bg-cyan-400, #skills .bg-red-400"
    );

    skillBars.forEach((bar) => {
      const width =
        bar.style.width ||
        bar.classList.toString().match(/w-\[(\d+)%\]/)?.[1] + "%";
      bar.style.width = "0%";

      setTimeout(() => {
        bar.style.transition = "width 2s ease-in-out";
        bar.style.width = width;
      }, 500);
    });
  }

  // Trigger skill bar animation when skills section is visible
  const skillsSection = document.querySelector("#skills");
  const skillsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateSkillBars();
          skillsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  // Form submission handling
  const contactForm = document.querySelector("#contact form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const name = formData.get("name");
      const email = formData.get("email");
      const message = formData.get("message");

      // Basic validation
      if (!name || !email || !message) {
        showNotification("Please fill in all fields", "error");
        return;
      }

      if (!isValidEmail(email)) {
        showNotification("Please enter a valid email address", "error");
        return;
      }

      // Simulate form submission
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        this.reset();
        showNotification(
          "Message sent successfully! I'll get back to you soon.",
          "success"
        );
      }, 2000);
    });
  }

  // Email validation helper
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Notification system
  function showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((notification) => notification.remove());

    const notification = document.createElement("div");
    notification.className = `notification fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
      type === "success"
        ? "bg-green-600"
        : type === "error"
        ? "bg-red-600"
        : "bg-blue-600"
    } text-white`;

    notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${
                  type === "success"
                    ? "fa-check-circle"
                    : type === "error"
                    ? "fa-exclamation-circle"
                    : "fa-info-circle"
                } mr-2"></i>
                <span>${message}</span>
                <button class="ml-4 text-xl hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    &times;
                </button>
            </div>
        `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.remove("translate-x-full");
    }, 100);

    // Auto hide after 5 seconds
    setTimeout(() => {
      notification.classList.add("translate-x-full");
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  // Parallax effect for hero section
  function parallaxEffect() {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector("#home");
    const parallaxElements = heroSection.querySelectorAll(".animate-float");

    parallaxElements.forEach((element) => {
      const speed = 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  window.addEventListener("scroll", parallaxEffect);

  // Add loading animation
  window.addEventListener("load", function () {
    document.body.classList.add("loaded");

    // Trigger initial animations
    const heroElements = document.querySelectorAll("#home .animate-slide-up");
    heroElements.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = "1";
        element.classList.add("animate-slide-up");
      }, index * 200);
    });
  });

  // Project card hover effects
  const projectCards = document.querySelectorAll("#projects .group");
  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Initialize everything
  updateActiveNavLink();
  updateNavbarBackground();

  console.log("🚀 David's Portfolio Website loaded successfully!");
});
