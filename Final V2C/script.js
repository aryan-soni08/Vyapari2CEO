/**
 * Vyapari to CEO by Rahul Malodia
 * Enhanced JavaScript with dark theme support
 * Maintains the original color theme and concept
 */

// DOM Elements
const body = document.body;
const preloader = document.querySelector('.preloader');
const pageTransition = document.querySelector('.page-transition-overlay');
const mainNav = document.querySelector('.main-nav');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const cursorFollower = document.querySelector('.cursor-follower');
const cursorDot = document.querySelector('.cursor-dot');
const heroStats = document.querySelectorAll('.stat-number');
const backToTop = document.getElementById('back-to-top');
const themeToggle = document.getElementById('theme-toggle');

// Section-specific elements
const quoteContainer = document.querySelector('.quotes-container');
const quotes = document.querySelectorAll('.quote');
const quoteDots = document.querySelectorAll('.quote-dots .dot');
const quoteToggleBtn = document.querySelector('.quote-toggle-btn');
const testimonialContainer = document.querySelector('.testimonial-container');
const testimonials = document.querySelectorAll('.testimonial');
const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
const testimonialPrev = document.querySelector('.testimonial-prev');
const testimonialNext = document.querySelector('.testimonial-next');

// Global Variables
let quoteInterval;
let isPaused = false;
let currentQuote = 0;
let currentTestimonial = 0;
let isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
let isDarkMode = false;

// Utility Functions
const throttle = (func, limit) => {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

// Handle page load
document.addEventListener('DOMContentLoaded', () => {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark') {
    enableDarkMode();
  }
  
  // Start AOS-like animations
  initAOSAnimations();
  
  // Smooth scrolling for anchor links
  initSmoothScrolling();
  
  // Init keyboard navigation
  initKeyboardNav();
  
  // Theme switcher
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
});

// Window load event for preloader
window.addEventListener('load', () => {
  // Hide preloader with animation
  setTimeout(() => {
    const loadingText = document.querySelector('.loading-text');
    if (loadingText) loadingText.style.opacity = '0';
    
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
        body.classList.remove('loading');
        
        // Start animations
        animateHeroElements();
        startQuoteRotation();
        
        // Initialize cursor effects for desktop
        if (!isTouch) {
          initCursorEffects();
        } else {
          // Hide cursor elements on touch devices
          if (cursorFollower) cursorFollower.style.display = 'none';
          if (cursorDot) cursorDot.style.display = 'none';
        }
      }, 300);
    }, 500);
  }, 1000);
});

// Toggle Dark/Light Theme
function toggleTheme() {
  if (isDarkMode) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
}

function enableDarkMode() {
  document.documentElement.setAttribute('data-theme', 'dark');
  localStorage.setItem('theme', 'dark');
  isDarkMode = true;
}

function disableDarkMode() {
  document.documentElement.removeAttribute('data-theme');
  localStorage.setItem('theme', 'light');
  isDarkMode = false;
}

// Animate hero elements
function animateHeroElements() {
  // Animate statistics
  if (heroStats.length > 0) {
    heroStats.forEach(stat => {
      const finalValue = parseInt(stat.getAttribute('data-count'));
      animateCounter(stat, finalValue);
    });
  }
}

// Counter animation
function animateCounter(element, target) {
  let current = 0;
  const increment = target / 100;
  const duration = 2000; // 2 seconds
  const frameDuration = duration / (target / increment);
  
  const counter = setInterval(() => {
    current += increment;
    
    if (current >= target) {
      element.textContent = target;
      clearInterval(counter);
    } else {
      element.textContent = Math.round(current);
    }
  }, frameDuration);
}

// Navigation Menu Toggle
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    menuToggle.parentElement.classList.toggle('menu-active');
    mobileMenu.classList.toggle('active');
  });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.parentElement.classList.remove('menu-active');
    mobileMenu.classList.remove('active');
  });
});

// Quote Carousel Functions
function startQuoteRotation() {
  if (quotes.length > 0) {
    quoteInterval = setInterval(nextQuote, 5000);
  }
}

function nextQuote() {
  if (quotes.length > 0) {
    quotes[currentQuote].classList.remove('active');
    quoteDots[currentQuote].classList.remove('active');
    
    currentQuote = (currentQuote + 1) % quotes.length;
    
    quotes[currentQuote].classList.add('active');
    quoteDots[currentQuote].classList.add('active');
  }
}

// Quote dots and controls
if (quoteDots.length > 0) {
  quoteDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (quoteInterval) clearInterval(quoteInterval);
      
      quotes[currentQuote].classList.remove('active');
      quoteDots[currentQuote].classList.remove('active');
      
      currentQuote = index;
      
      quotes[currentQuote].classList.add('active');
      quoteDots[currentQuote].classList.add('active');
      
      if (!isPaused) {
        quoteInterval = setInterval(nextQuote, 5000);
      }
    });
  });
}

// Quote toggle button
if (quoteToggleBtn) {
  quoteToggleBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    
    if (isPaused) {
      clearInterval(quoteInterval);
      quoteToggleBtn.classList.add('paused');
    } else {
      quoteInterval = setInterval(nextQuote, 5000);
      quoteToggleBtn.classList.remove('paused');
    }
  });
}

// Testimonial Carousel Functions
function showTestimonial(index) {
  if (testimonials.length > 0) {
    testimonials[currentTestimonial].classList.remove('active');
    if (testimonialDots.length > 0) {
      testimonialDots[currentTestimonial].classList.remove('active');
    }
    
    currentTestimonial = index;
    
    testimonials[currentTestimonial].classList.add('active');
    if (testimonialDots.length > 0) {
      testimonialDots[currentTestimonial].classList.add('active');
    }
  }
}

// Testimonial controls
if (testimonialPrev) {
  testimonialPrev.addEventListener('click', () => {
    let prevIndex = currentTestimonial - 1;
    if (prevIndex < 0) prevIndex = testimonials.length - 1;
    showTestimonial(prevIndex);
  });
}

if (testimonialNext) {
  testimonialNext.addEventListener('click', () => {
    let nextIndex = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(nextIndex);
  });
}

// Testimonial dots
if (testimonialDots.length > 0) {
  testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showTestimonial(index);
    });
  });
}

// Scroll events for header style and back to top button
window.addEventListener('scroll', throttle(() => {
  const scrollPosition = window.scrollY;
  
  // Change header style on scroll
  if (scrollPosition > 50) {
    mainNav.classList.add('scrolled');
  } else {
    mainNav.classList.remove('scrolled');
  }
  
  // Show/hide back to top button
  if (backToTop) {
    if (scrollPosition > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
  
  // Trigger animations for elements in viewport
  triggerScrollAnimations();
}, 100));

// AOS-like animations on scroll
function initAOSAnimations() {
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  animatedElements.forEach(element => {
    // Set initial state
    element.style.opacity = '0';
    
    if (element.getAttribute('data-aos') === 'fade-up') {
      element.style.transform = 'translateY(50px)';
    } else if (element.getAttribute('data-aos') === 'fade-right') {
      element.style.transform = 'translateX(-50px)';
    } else if (element.getAttribute('data-aos') === 'fade-left') {
      element.style.transform = 'translateX(50px)';
    }
    
    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  });
  
  // Trigger initial animations for elements already in viewport
  setTimeout(() => {
    triggerScrollAnimations();
  }, 100);
}

function triggerScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  animatedElements.forEach(element => {
    if (isElementInViewport(element) && !element.classList.contains('aos-animate')) {
      // Apply animation after delay if specified
      const delay = element.getAttribute('data-aos-delay') || 0;
      
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translate(0, 0)';
        element.classList.add('aos-animate');
      }, delay);
    }
  });
}

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
    rect.bottom >= 0
  );
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Highlight nav link
        if (this.classList.contains('nav-link')) {
          document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
          });
          this.classList.add('active');
        }
        
        // Offset for fixed header
        const headerHeight = mainNav.offsetHeight;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Custom cursor effects for desktop
function initCursorEffects() {
  if (!cursorFollower || !cursorDot) return;
  
  // Show cursor elements
  cursorFollower.style.opacity = '1';
  cursorDot.style.opacity = '1';
  
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let dotX = 0, dotY = 0;
  
  // Update cursor position on mouse move
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Interactive elements for cursor effects
  const interactiveElements = document.querySelectorAll('a, button, .cta-button, .nav-link, .mobile-link, .program-card, .credential, .feature-item, .format-card, .contact-card, .social-link, .testimonial-prev, .testimonial-next, .quote-dots .dot, .testimonial-dots .dot');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursorFollower.style.width = '50px';
      cursorFollower.style.height = '50px';
      cursorFollower.style.backgroundColor = 'rgba(230, 126, 34, 0.15)';
      cursorFollower.style.mixBlendMode = 'multiply';
    });
    
    element.addEventListener('mouseleave', () => {
      cursorFollower.style.width = '36px';
      cursorFollower.style.height = '36px';
      cursorFollower.style.backgroundColor = isDarkMode ? 'rgba(58, 91, 159, 0.15)' : 'rgba(14, 39, 87, 0.1)';
      cursorFollower.style.mixBlendMode = 'normal';
    });
  });
  
  // Animation loop for smooth cursor movement
  const updateCursor = () => {
    // Smooth follower movement with lag
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    // Instant dot movement
    dotX += (mouseX - dotX) * 0.6;
    dotY += (mouseY - dotY) * 0.6;
    
    cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
    
    requestAnimationFrame(updateCursor);
  };
  
  updateCursor();
}

// Page transitions for smoother navigation
function initPageTransition() {
  // For internal links with data-transition attribute
  document.querySelectorAll('a[data-transition]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      
      // Show transition overlay
      pageTransition.classList.add('active');
      
      // Navigate after transition
      setTimeout(() => {
        window.location.href = href;
      }, 600);
    });
  });
}

// Keyboard navigation
function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    // ESC key to close mobile menu
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      menuToggle.parentElement.classList.remove('menu-active');
      mobileMenu.classList.remove('active');
    }
    
    // D key for dark mode toggle
    if (e.key === 'd' && e.altKey) {
      toggleTheme();
    }
    
    // Arrow keys for testimonials
    if (testimonials.length > 0) {
      if (e.key === 'ArrowLeft' && testimonialPrev) {
        let prevIndex = currentTestimonial - 1;
        if (prevIndex < 0) prevIndex = testimonials.length - 1;
        showTestimonial(prevIndex);
      }
      
      if (e.key === 'ArrowRight' && testimonialNext) {
        let nextIndex = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(nextIndex);
      }
    }
  });
}

// Form submission with validation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Basic validation
    const formElements = contactForm.elements;
    let isValid = true;
    
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];
      
      if (element.hasAttribute('required') && !element.value.trim()) {
        element.style.borderColor = 'var(--accent-red)';
        isValid = false;
      } else if (element.type === 'email' && element.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(element.value)) {
          element.style.borderColor = 'var(--accent-red)';
          isValid = false;
        } else {
          element.style.borderColor = '';
        }
      } else {
        element.style.borderColor = '';
      }
    }
    
    if (isValid) {
      // Form is valid - typically would send data to server
      const submitButton = contactForm.querySelector('.submit-button');
      submitButton.textContent = 'Message Sent!';
      submitButton.style.backgroundColor = 'var(--accent-green)';
      
      // Reset form
      setTimeout(() => {
        contactForm.reset();
        submitButton.textContent = 'Send Message';
        submitButton.style.backgroundColor = '';
      }, 3000);
    }
  });
}

// Back to top button 
if (backToTop) {
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}