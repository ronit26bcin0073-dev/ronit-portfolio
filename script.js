/**
 * Ronit Jain - Personal Portfolio JavaScript
 * Plain, Clean Vanilla JavaScript for Navigation, Theme Toggle,
 * Dynamic Typing, Interactive Modal, Working Calculator Demo, and Form Validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------------
  // 1. Theme Management (Dark / Light Mode)
  // ---------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved preference or default to dark theme
  const savedTheme = localStorage.getItem('ronit-portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'dark');

  htmlRoot.setAttribute('data-theme', initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('ronit-portfolio-theme', newTheme);
    });
  }

  // ---------------------------------------------------------------------------
  // 2. Navigation, Sticky Header & Scrollspy
  // ---------------------------------------------------------------------------
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top');

  // Sticky header background and Scrollspy on scroll
  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header glass background
    if (scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Scrollspy: update active link in nav menu
    const scrollPosition = scrollY + 140;
    sections.forEach(currentSection => {
      const sectionHeight = currentSection.offsetHeight;
      const sectionTop = currentSection.offsetTop;
      const sectionId = currentSection.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial run

  // Mobile menu open / close toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (!navMenu.contains(event.target) && !menuToggle.contains(event.target) && navMenu.classList.contains('open')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        navMenu.classList.remove('open');
      }
    });
  }

  // Smooth Back-to-Top scroll
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------------------------------------------------------------------------
  // 3. Dynamic Typing Animation in Hero
  // ---------------------------------------------------------------------------
  const typingElement = document.getElementById('hero-typing');
  if (typingElement) {
    const titles = [
      'Civil Engineering Student',
      'Tech & Web Enthusiast',
      'Curious Learner',
      'Creative Problem Solver',
      'Aspiring Tech Professional'
    ];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    const typeEffect = () => {
      const currentTitle = titles[titleIndex];

      if (isDeleting) {
        typingElement.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        typingElement.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 85;
      }

      if (!isDeleting && charIndex === currentTitle.length) {
        typingSpeed = 1800; // Pause when word is completely typed
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typingSpeed = 400; // Pause before starting next word
      }

      setTimeout(typeEffect, typingSpeed);
    };

    setTimeout(typeEffect, 500);
  }

  // ---------------------------------------------------------------------------
  // 4. Skills Filtering
  // ---------------------------------------------------------------------------
  const skillTabs = document.querySelectorAll('.skill-tab');
  const skillCards = document.querySelectorAll('.skills-grid .skill-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');

          // Trigger smooth bar width animation
          const barFill = card.querySelector('.skill-bar-fill');
          if (barFill) {
            const currentWidth = barFill.style.width;
            barFill.style.width = '0%';
            requestAnimationFrame(() => {
              barFill.style.width = currentWidth;
            });
          }
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 5. Interactive Modal (Project Previews, Live Calculator, CV)
  // ---------------------------------------------------------------------------
  const modal = document.getElementById('info-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalActionBtn = document.getElementById('modal-action-btn');
  const resumeBtn = document.getElementById('resume-btn');

  // Open modal helper
  const openModal = (title, contentHtml) => {
    if (!modal || !modalTitle || !modalBody) return;
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHtml;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  // Close modal helper
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalActionBtn) modalActionBtn.addEventListener('click', closeModal);

  if (modal) {
    const backdrop = modal.querySelector('.modal-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeModal);
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeModal();
    }
  });

  // Project data for modal
  const projectDetails = {
    portfolio: {
      title: 'Personal Portfolio Website - Architecture & Details',
      content: `
        <div class="project-modal-view">
          <p><strong>Personal Portfolio Website</strong> was built to showcase my academic journey, technical skills, and projects in a professional, accessible, and responsive manner.</p>
          
          <div style="margin: 1.25rem 0; padding: 1rem 1.25rem; background: var(--bg-tertiary); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <h4 style="color: var(--text-primary); margin-bottom: 0.65rem;">Key Features & Architecture:</h4>
            <ul style="list-style: disc; padding-left: 1.25rem; font-size: 0.92rem; line-height: 1.7; color: var(--text-secondary);">
              <li><strong>Semantic HTML5:</strong> Clean document structure using header, main, section, nav, and article tags.</li>
              <li><strong>Modern CSS3:</strong> Built with CSS Custom Properties (variables), Flexbox, CSS Grid, and custom animations.</li>
              <li><strong>Dark / Light Theming:</strong> Instant theme switcher with localStorage persistence for user comfort.</li>
              <li><strong>Responsive Design:</strong> Fluid layout supporting desktop, laptop, tablet, and mobile phone screens.</li>
              <li><strong>Interactive Vanilla JavaScript:</strong> Modal previews, dynamic typing text, and contact form handling with zero external libraries.</li>
            </ul>
          </div>

          <p><strong>Technologies Used:</strong> HTML5, CSS3, Vanilla JavaScript (ES6+), Google Fonts, Scalable Vector Graphics (SVG).</p>

          <div style="margin-top: 1.5rem; display: flex; gap: 0.85rem; flex-wrap: wrap;">
            <a href="https://github.com/ronit-jain" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">View GitHub Repository</a>
            <a href="#contact" class="btn btn-sm btn-outline modal-contact-link">Get In Touch</a>
          </div>
        </div>
      `
    },
    calculator: {
      title: 'Basic Calculator - Live Interactive App',
      content: `
        <div class="project-modal-view">
          <p style="margin-bottom: 1rem;">Experience the <strong>Basic Calculator</strong> below. You can click the buttons or use your physical keyboard to perform operations!</p>
          
          <!-- Live Interactive Calculator Component -->
          <div class="calc-container" id="live-calculator">
            <div class="calc-screen">
              <div class="calc-history" id="calc-history">&nbsp;</div>
              <div class="calc-main-display" id="calc-display">0</div>
            </div>
            <div class="calc-buttons-grid">
              <button class="calc-btn clear-btn" data-calc="clear">C</button>
              <button class="calc-btn op-btn" data-calc="backspace">&larr;</button>
              <button class="calc-btn op-btn" data-calc="%">%</button>
              <button class="calc-btn op-btn" data-calc="/">&divide;</button>

              <button class="calc-btn" data-calc="7">7</button>
              <button class="calc-btn" data-calc="8">8</button>
              <button class="calc-btn" data-calc="9">9</button>
              <button class="calc-btn op-btn" data-calc="*">&times;</button>

              <button class="calc-btn" data-calc="4">4</button>
              <button class="calc-btn" data-calc="5">5</button>
              <button class="calc-btn" data-calc="6">6</button>
              <button class="calc-btn op-btn" data-calc="-">&minus;</button>

              <button class="calc-btn" data-calc="1">1</button>
              <button class="calc-btn" data-calc="2">2</button>
              <button class="calc-btn" data-calc="3">3</button>
              <button class="calc-btn op-btn" data-calc="+">+</button>

              <button class="calc-btn" data-calc="0">0</button>
              <button class="calc-btn" data-calc=".">.</button>
              <button class="calc-btn equal-btn" data-calc="=">=</button>
            </div>
          </div>

          <div style="margin-top: 1.25rem; font-size: 0.85rem; color: var(--text-muted); text-align: center;">
            Built with pure JavaScript logic &bull; Supports chained operations, decimal validation, and clear entry.
          </div>
        </div>
      `
    },
    practice: {
      title: 'Web Development Practice Projects',
      content: `
        <div class="project-modal-view">
          <p>As part of my beginner web development journey in my 1st year at <strong>JECRC University</strong>, I built several structured mini-projects to solidify my HTML, CSS, and JavaScript foundation:</p>
          
          <div style="margin: 1.25rem 0; display: flex; flex-direction: column; gap: 0.85rem;">
            <div style="padding: 0.85rem 1.15rem; background: var(--bg-tertiary); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <h4 style="color: var(--text-primary); font-size: 1rem; margin-bottom: 0.25rem;">1. Basic Calculator</h4>
              <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0;">Interactive arithmetic calculator application utilizing DOM manipulation, event listeners, and mathematical evaluation.</p>
            </div>

            <div style="padding: 0.85rem 1.15rem; background: var(--bg-tertiary); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <h4 style="color: var(--text-primary); font-size: 1rem; margin-bottom: 0.25rem;">2. Personal Portfolio Website</h4>
              <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0;">A full multi-section responsive personal profile featuring CSS grid layouts, smooth navigation, and dark/light mode.</p>
            </div>

            <div style="padding: 0.85rem 1.15rem; background: var(--bg-tertiary); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <h4 style="color: var(--text-primary); font-size: 1rem; margin-bottom: 0.25rem;">3. Interactive Web Practice Lab</h4>
              <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0;">Mini-experiments exploring CSS Flexbox alignment, keyframe animations, form input validations, and JavaScript array manipulation.</p>
            </div>
          </div>

          <p><strong>Next Goals:</strong> Expanding knowledge into Data Structures, modern frontend tooling, and collaborative software projects.</p>
          
          <div style="margin-top: 1.5rem;">
            <a href="https://github.com/ronit-jain" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">Check GitHub Profile</a>
          </div>
        </div>
      `
    }
  };

  // Setup Live Calculator Logic
  const initLiveCalculator = () => {
    const calcContainer = document.getElementById('live-calculator');
    if (!calcContainer) return;

    const display = document.getElementById('calc-display');
    const history = document.getElementById('calc-history');
    if (!display || !history) return;

    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let shouldResetDisplay = false;

    const updateDisplay = () => {
      display.textContent = currentInput;
      if (operation !== null) {
        history.textContent = `${previousInput} ${operation}`;
      } else {
        history.innerHTML = '&nbsp;';
      }
    };

    const appendNumber = (number) => {
      if (currentInput === '0' || shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
      } else {
        currentInput += number;
      }
      updateDisplay();
    };

    const appendDecimal = () => {
      if (shouldResetDisplay) {
        currentInput = '0.';
        shouldResetDisplay = false;
        updateDisplay();
        return;
      }
      if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay();
      }
    };

    const chooseOperation = (op) => {
      if (currentInput === '') return;
      if (previousInput !== '' && operation !== null) {
        compute();
      }
      operation = op;
      previousInput = currentInput;
      shouldResetDisplay = true;
      updateDisplay();
    };

    const compute = () => {
      let computation;
      const prev = parseFloat(previousInput);
      const current = parseFloat(currentInput);

      if (isNaN(prev) || isNaN(current)) return;

      switch (operation) {
        case '+':
          computation = prev + current;
          break;
        case '-':
          computation = prev - current;
          break;
        case '*':
          computation = prev * current;
          break;
        case '/':
          if (current === 0) {
            currentInput = 'Error';
            operation = null;
            previousInput = '';
            updateDisplay();
            shouldResetDisplay = true;
            return;
          }
          computation = prev / current;
          break;
        case '%':
          computation = prev % current;
          break;
        default:
          return;
      }

      // Limit floating precision
      computation = Math.round(computation * 1000000) / 1000000;
      currentInput = computation.toString();
      operation = null;
      previousInput = '';
      shouldResetDisplay = true;
      updateDisplay();
    };

    const clearCalculator = () => {
      currentInput = '0';
      previousInput = '';
      operation = null;
      shouldResetDisplay = false;
      updateDisplay();
    };

    const backspaceCalculator = () => {
      if (shouldResetDisplay) return;
      if (currentInput.length === 1 || currentInput === 'Error') {
        currentInput = '0';
      } else {
        currentInput = currentInput.slice(0, -1);
      }
      updateDisplay();
    };

    // Button clicks
    calcContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const action = btn.getAttribute('data-calc');

      if (!isNaN(action)) {
        appendNumber(action);
      } else if (action === '.') {
        appendDecimal();
      } else if (action === 'clear') {
        clearCalculator();
      } else if (action === 'backspace') {
        backspaceCalculator();
      } else if (action === '=') {
        compute();
      } else if (['+', '-', '*', '/', '%'].includes(action)) {
        chooseOperation(action);
      }
    });

    // Keyboard support inside calculator modal
    const handleKeydown = (e) => {
      if (!modal?.classList.contains('active')) return;
      if ((e.key >= '0' && e.key <= '9')) {
        appendNumber(e.key);
      } else if (e.key === '.') {
        appendDecimal();
      } else if (e.key === '=' || e.key === 'Enter') {
        e.preventDefault();
        compute();
      } else if (e.key === 'Backspace') {
        backspaceCalculator();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        clearCalculator();
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        chooseOperation(e.key);
      }
    };

    document.addEventListener('keydown', handleKeydown);
  };

  // Wire up project details buttons
  const projectButtons = document.querySelectorAll('.project-details-btn');
  projectButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectKey = btn.getAttribute('data-project');
      const details = projectDetails[projectKey];
      if (details) {
        openModal(details.title, details.content);
        if (projectKey === 'calculator') {
          initLiveCalculator();
        }
        // Wire up any contact triggers inside modal
        const modalContactLinks = modalBody.querySelectorAll('.modal-contact-link');
        modalContactLinks.forEach(link => {
          link.addEventListener('click', () => {
            closeModal();
          });
        });
      }
    });
  });

  // Resume / CV Button Handler
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      const resumeContent = `
        <div class="resume-modal-view">
          <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.25rem;">
            <h2 style="font-size: 1.5rem; color: var(--text-primary); margin-bottom: 0.25rem;">Ronit Jain</h2>
            <p style="color: var(--accent-primary); font-weight: 600; margin-bottom: 0.5rem;">Civil Engineering &bull; 1st Year</p>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0;">JECRC University, Jaipur | ronit.jain@example.com</p>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <h4 style="font-size: 1rem; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Academic Profile</h4>
            <div style="font-size: 0.92rem; line-height: 1.6; color: var(--text-secondary);">
              <p><strong>JECRC University:</strong> B.Tech in Civil Engineering (1st Year, 2024 - Present)</p>
              <p><strong>Senior Secondary School:</strong> Science & Mathematics Stream</p>
            </div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <h4 style="font-size: 1rem; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Technical Skills & Strengths</h4>
            <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">
              <strong>Technical:</strong> HTML5, CSS3, JavaScript (ES6+), Git & GitHub, Responsive Web Design.<br>
              <strong>Strengths:</strong> Reading & Research, Effective Communication, Teamwork & Collaboration, Problem Solving.
            </p>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <h4 style="font-size: 1rem; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Projects</h4>
            <ul style="list-style: disc; padding-left: 1.25rem; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
              <li><strong>Personal Portfolio Website:</strong> Responsive modern web portfolio built using HTML, CSS, and JavaScript.</li>
              <li><strong>Basic Calculator:</strong> Interactive arithmetic web calculator with keyboard input support and clean DOM logic.</li>
              <li><strong>Web Practice Projects:</strong> Foundational front-end layouts and interactive components.</li>
            </ul>
          </div>

          <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem;">
            <a href="mailto:ronit.jain@example.com" class="btn btn-sm btn-primary">Contact via Email</a>
            <button class="btn btn-sm btn-secondary" onclick="window.print()">Print / Save PDF</button>
          </div>
        </div>
      `;
      openModal('Ronit Jain - Profile CV', resumeContent);
    });
  }

  // ---------------------------------------------------------------------------
  // 6. Contact Form Validation & Submission
  // ---------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && submitBtn && formFeedback) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Real-time error clearance
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (!input) return;
      input.addEventListener('input', () => {
        input.parentElement?.classList.remove('has-error');
        formFeedback.style.display = 'none';
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.parentElement?.classList.add('has-error');
        isValid = false;
      } else {
        nameInput.parentElement?.classList.remove('has-error');
      }

      // Validate Email
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.parentElement?.classList.add('has-error');
        isValid = false;
      } else {
        emailInput.parentElement?.classList.remove('has-error');
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        subjectInput.parentElement?.classList.add('has-error');
        isValid = false;
      } else {
        subjectInput.parentElement?.classList.remove('has-error');
      }

      // Validate Message (min 10 characters)
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        messageInput.parentElement?.classList.add('has-error');
        isValid = false;
      } else {
        messageInput.parentElement?.classList.remove('has-error');
      }

      if (!isValid) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please fill out all required fields correctly.';
        formFeedback.style.display = 'block';
        return;
      }

      // Display spinner & simulate form submission
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');

      if (btnText) btnText.textContent = 'Sending...';
      if (btnSpinner) btnSpinner.style.display = 'inline-block';
      submitBtn.disabled = true;

      setTimeout(() => {
        if (btnText) btnText.textContent = 'Send Message';
        if (btnSpinner) btnSpinner.style.display = 'none';
        submitBtn.disabled = false;

        // Feedback success
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = '<strong>Thank you!</strong> Your message has been sent successfully. I will get back to you shortly.';
        formFeedback.style.display = 'block';

        contactForm.reset();
      }, 1000);
    });
  }

  // ---------------------------------------------------------------------------
  // 7. Dynamic Current Year in Footer
  // ---------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
