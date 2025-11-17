// MRF Compiler Website - Main TypeScript
// Copyright (C) 2025, Shyamal Suhana Chandra

import { QuantumCanvas, QuantumCircuitCanvas } from './canvas-effects';
import { HeroCanvas } from './hero-canvas';
import { PDFViewer, PDFCard, PDFInfo } from './pdf-viewer';

// Navigation toggle functionality
function initNavigation(): void {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.navbar')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  }
}

// Copy code block functionality
function initCodeCopy(): void {
  const copyButtons = document.querySelectorAll('.copy-btn');
  
  copyButtons.forEach((button) => {
    // Remove any existing listeners to avoid duplicates
    const newButton = button.cloneNode(true) as HTMLButtonElement;
    button.parentNode?.replaceChild(newButton, button);
    
    newButton.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      
      const btn = e.currentTarget as HTMLButtonElement;
      const codeBlock = btn.closest('.code-block');
      const codeElement = codeBlock?.querySelector('code');
      
      if (codeElement) {
        const text = codeElement.textContent || '';
        const originalText = btn.textContent || 'Copy';
        
        try {
          await navigator.clipboard.writeText(text);
          btn.textContent = 'Copied!';
          btn.style.background = '#10b981';
          
          setTimeout(() => {
            if (btn) {
              btn.textContent = originalText;
              btn.style.background = '';
            }
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand('copy');
            btn.textContent = 'Copied!';
            btn.style.background = '#10b981';
            setTimeout(() => {
              if (btn) {
                btn.textContent = originalText;
                btn.style.background = '';
              }
            }, 2000);
          } catch (e) {
            console.error('Fallback copy failed:', e);
          }
          document.body.removeChild(textarea);
        }
      }
    });
  });
}

// Installation tabs functionality
function initInstallationTabs(): void {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const targetTab = button.getAttribute('data-tab');
      
      if (!targetTab) return;
      
      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove('active'));
      tabContents.forEach((content) => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      const targetContent = document.getElementById(targetTab);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

// Smooth scroll for anchor links
function initSmoothScroll(): void {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const href = (anchor as HTMLAnchorElement).getAttribute('href');
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// Intersection Observer for fade-in animations
function initScrollAnimations(): void {
  const observerOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with animation class
  document.querySelectorAll('.feature-card, .doc-card, .example-card, .framework-badge').forEach((el) => {
    observer.observe(el);
  });
}

// Dark mode toggle functionality
function initDarkMode(): void {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggle && themeIcon) {
    themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const currentTheme = html.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
      
      // Add transition effect
      html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    });
  }
}

function updateThemeIcon(theme: string): void {
  const themeIcon = document.getElementById('themeIcon');
  if (!themeIcon) return;

  if (theme === 'dark') {
    // Show sun icon when in dark mode (clicking will switch to light)
    themeIcon.innerHTML = `
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    `;
  } else {
    // Show moon icon when in light mode (clicking will switch to dark)
    themeIcon.innerHTML = `
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    `;
  }
}

// Parallax effect for hero section
function initParallax(): void {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = hero.querySelector('.hero-content') as HTMLElement;
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
      heroContent.style.opacity = `${1 - scrolled / 500}`;
    }
  });
}

// Navbar scroll effect
function initNavbarScroll(): void {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Smooth scroll for scroll indicator
function initScrollIndicator(): void {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const featuresSection = document.querySelector('.features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

// Floating particles animation
function initParticles(): void {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const particles: Array<{ x: number; y: number; radius: number; speedX: number; speedY: number; opacity: number }> = [];
  const particleCount = 50;

  function resizeCanvas(): void {
    if (hero) {
      canvas.width = hero.clientWidth;
      canvas.height = hero.clientHeight;
    }
  }

  function createParticle(): { x: number; y: number; radius: number; speedX: number; speedY: number; opacity: number } {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2
    };
  }

  function initParticlesArray(): void {
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
  }

  function animate(): void {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
      ctx.fill();

      // Connect nearby particles
      particles.slice(index + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(animate);
  }

  resizeCanvas();
  initParticlesArray();
  animate();

  window.addEventListener('resize', resizeCanvas);
}

// Scroll progress indicator
function initScrollProgress(): void {
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
    z-index: 10000;
    transition: width 0.1s ease-out;
    box-shadow: 0 2px 10px rgba(99, 102, 241, 0.5);
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
  });
}

// Staggered animations for cards
function initStaggeredAnimations(): void {
  const cards = document.querySelectorAll('.feature-card, .doc-card, .framework-badge');
  cards.forEach((card, index) => {
    (card as HTMLElement).style.animationDelay = `${index * 0.1}s`;
  });
}

// Cursor trail effect
function initCursorTrail(): void {
  const trail: Array<{ x: number; y: number; opacity: number }> = [];
  const trailLength = 20;

  document.addEventListener('mousemove', (e) => {
    trail.push({ x: e.clientX, y: e.clientY, opacity: 1 });

    if (trail.length > trailLength) {
      trail.shift();
    }

    // Update trail opacity
    trail.forEach((point, index) => {
      point.opacity = index / trailLength;
    });

    // Draw trail
    const existingTrail = document.getElementById('cursor-trail');
    if (existingTrail) {
      existingTrail.remove();
    }

    const trailElement = document.createElement('div');
    trailElement.id = 'cursor-trail';
    trailElement.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
    `;

    trail.forEach((point, index) => {
      const dot = document.createElement('div');
      const size = 4 * (1 - index / trailLength);
      dot.style.cssText = `
        position: absolute;
        left: ${point.x}px;
        top: ${point.y}px;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(99, 102, 241, ${point.opacity}) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
      `;
      trailElement.appendChild(dot);
    });

    document.body.appendChild(trailElement);
  });
}

// Confetti effect for button clicks
function initConfetti(): void {
  const buttons = document.querySelectorAll('.btn-primary');
  
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      createConfetti(e as MouseEvent);
    });
  });
}

function createConfetti(e: MouseEvent): void {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
  const confettiCount = 30;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 5;
    const x = e.clientX;
    const y = e.clientY;
    
    confetti.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      pointer-events: none;
      z-index: 10000;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      transform: rotate(${Math.random() * 360}deg);
    `;

    document.body.appendChild(confetti);

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 10 + 5;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    let px = x;
    let py = y;
    let opacity = 1;
    let rotation = Math.random() * 360;

    const animate = () => {
      px += vx;
      py += vy + 2; // gravity
      opacity -= 0.02;
      rotation += 10;

      if (opacity <= 0) {
        confetti.remove();
        return;
      }

      confetti.style.left = `${px}px`;
      confetti.style.top = `${py}px`;
      confetti.style.opacity = `${opacity}`;
      confetti.style.transform = `rotate(${rotation}deg)`;

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }
}

// Page transition effect
function initPageTransitions(): void {
  document.body.classList.add('page-transition');
  
  // Add transition class to main content
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.classList.add('page-transition');
  }
}

// Magnetic button effect
function initMagneticButtons(): void {
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
  
  buttons.forEach(button => {
    const btnElement = button as HTMLElement;
    btnElement.classList.add('btn-magnetic');
    
    btnElement.addEventListener('mousemove', (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect = btnElement.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left - rect.width / 2;
      const y = mouseEvent.clientY - rect.top - rect.height / 2;
      
      btnElement.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) translateY(-3px) scale(1.05)`;
    });
    
    btnElement.addEventListener('mouseleave', () => {
      btnElement.style.transform = '';
    });
  });
}

// Typing animation for hero title (optional enhancement)
function initTypingEffect(): void {
  const heroTitle = document.querySelector('.hero-title') as HTMLElement;
  if (!heroTitle) return;
  
  const text = heroTitle.textContent || '';
  if (text.length > 20) return; // Only for short titles
  
  heroTitle.textContent = '';
  heroTitle.style.borderRight = '2px solid white';
  heroTitle.style.animation = 'blink 1s infinite';
  
  let index = 0;
  const typeInterval = setInterval(() => {
    if (index < text.length) {
      heroTitle.textContent += text[index];
      index++;
    } else {
      clearInterval(typeInterval);
      setTimeout(() => {
        heroTitle.style.borderRight = 'none';
      }, 1000);
    }
  }, 100);
}

// Initialize all functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    initNavigation();
    initCodeCopy();
    initInstallationTabs();
    initSmoothScroll();
    initScrollAnimations();
    initDarkMode();
    initParallax();
    initScrollIndicator();
    initParticles();
    initScrollProgress();
    initStaggeredAnimations();
    initNavbarScroll();
    initPageTransitions();
    initMagneticButtons();
    
    // Only enable cursor trail on desktop for performance
    if (window.innerWidth > 768) {
      initCursorTrail();
    }
    
    initConfetti();
    initCanvasEffects();
    initPDFViewer();
  } catch (error) {
    console.error('Error during initialization:', error);
  }
});

// Make copyCode available globally for inline onclick handlers
// Initialize immediately so it's available before DOMContentLoaded
declare global {
  interface Window {
    copyCode: (button: HTMLButtonElement) => void;
  }
}

(function() {
  function copyCodeFunction(button: HTMLButtonElement): void {
    const codeBlock = button.closest('.code-block');
    const codeElement = codeBlock?.querySelector('code');
    
    if (codeElement) {
      const text = codeElement.textContent || '';
      const originalText = button.textContent || 'Copy';
      
      navigator.clipboard.writeText(text).then(() => {
        button.textContent = 'Copied!';
        button.style.background = '#10b981';
        
        setTimeout(() => {
          if (button) {
            button.textContent = originalText;
            button.style.background = '';
          }
        }, 2000);
      }).catch((err) => {
        console.error('Failed to copy:', err);
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          button.textContent = 'Copied!';
          setTimeout(() => {
            if (button) {
              button.textContent = originalText;
            }
          }, 2000);
        } catch (e) {
          console.error('Fallback copy failed:', e);
        }
        document.body.removeChild(textarea);
      });
    }
  }
  
  // Make it available on window immediately
  if (typeof window !== 'undefined') {
    (window as any).copyCode = copyCodeFunction;
  }
})();

// Initialize enhanced Canvas effects
function initCanvasEffects(): void {
  // Initialize hero canvas
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    try {
      new HeroCanvas('hero-canvas');
    } catch (err) {
      console.warn('Could not initialize hero canvas:', err);
    }
  }

  // Initialize quantum particle canvas if element exists
  const quantumCanvas = document.getElementById('quantum-canvas');
  if (quantumCanvas) {
    try {
      // Wait a bit for layout to settle
      setTimeout(() => {
        try {
          new QuantumCanvas('quantum-canvas');
        } catch (err) {
          console.error('Could not initialize quantum canvas:', err);
        }
      }, 100);
    } catch (err) {
      console.warn('Could not initialize quantum canvas:', err);
    }
  }

  // Initialize quantum circuit canvas if element exists
  const circuitCanvas = document.getElementById('circuit-canvas');
  if (circuitCanvas) {
    try {
      // Wait a bit for layout to settle
      setTimeout(() => {
        try {
          new QuantumCircuitCanvas('circuit-canvas');
        } catch (err) {
          console.error('Could not initialize circuit canvas:', err);
        }
      }, 100);
    } catch (err) {
      console.warn('Could not initialize circuit canvas:', err);
    }
  }
}

// Initialize PDF viewer and cards
function initPDFViewer(): void {
  try {
    const pdfViewer = new PDFViewer();
    const pdfCards: PDFCard[] = [];

    // Find all PDF cards
    const docCards = document.querySelectorAll('.doc-card[data-pdf-url]');
    
    docCards.forEach((card) => {
      try {
        const cardEl = card as HTMLElement;
        const pdfUrl = cardEl.getAttribute('data-pdf-url');
        const pdfTitle = cardEl.getAttribute('data-pdf-title') || 'Document';
        const pdfType = (cardEl.getAttribute('data-pdf-type') || 'paper') as 'paper' | 'presentation' | 'reference';
        
        if (pdfUrl) {
          const iconMap: Record<string, string> = {
            paper: '📄',
            presentation: '📊',
            reference: '📖'
          };

          const pdfInfo: PDFInfo = {
            title: pdfTitle,
            description: '',
            url: pdfUrl,
            icon: iconMap[pdfType] || '📄',
            type: pdfType
          };

          const pdfCard = new PDFCard(cardEl, pdfInfo, pdfViewer);
          pdfCards.push(pdfCard);
        }
      } catch (err) {
        console.warn('Error initializing PDF card:', err);
      }
    });
  } catch (err) {
    console.error('Error initializing PDF viewer:', err);
    // Fallback: make PDF cards open in new tab
    const docCards = document.querySelectorAll('.doc-card[data-pdf-url]');
    docCards.forEach((card) => {
      const cardEl = card as HTMLElement;
      const pdfUrl = cardEl.getAttribute('data-pdf-url');
      if (pdfUrl) {
        cardEl.addEventListener('click', () => {
          window.open(pdfUrl, '_blank');
        });
      }
    });
  }
}

