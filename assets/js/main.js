"use strict";
// MRF Compiler Website - Main TypeScript
// Copyright (C) 2025, Shyamal Suhana Chandra
// Navigation toggle functionality
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (!target.closest('.navbar')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}
// Copy code block functionality
function initCodeCopy() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach((button) => {
        button.addEventListener('click', async (e) => {
            const btn = e.currentTarget;
            const codeBlock = btn.closest('.code-block');
            const codeElement = codeBlock?.querySelector('code');
            if (codeElement) {
                const text = codeElement.textContent || '';
                try {
                    await navigator.clipboard.writeText(text);
                    const originalText = btn.textContent;
                    btn.textContent = 'Copied!';
                    btn.style.background = '#10b981';
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.background = '';
                    }, 2000);
                }
                catch (err) {
                    console.error('Failed to copy:', err);
                    // Fallback for older browsers
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    btn.textContent = 'Copied!';
                    setTimeout(() => {
                        btn.textContent = 'Copy';
                    }, 2000);
                }
            }
        });
    });
}
// Installation tabs functionality
function initInstallationTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            // Remove active class from all buttons and contents
            tabButtons.forEach((btn) => btn.classList.remove('active'));
            tabContents.forEach((content) => content.classList.remove('active'));
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const targetContent = document.getElementById(targetTab || '');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}
// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const href = anchor.getAttribute('href');
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
function initScrollAnimations() {
    const observerOptions = {
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
function initDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    if (themeToggle && themeIcon) {
        themeToggle.addEventListener('click', () => {
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
function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('themeIcon');
    if (!themeIcon)
        return;
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
    }
    else {
        // Show moon icon when in light mode (clicking will switch to dark)
        themeIcon.innerHTML = `
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    `;
    }
}
// Parallax effect for hero section
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero)
        return;
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = `${1 - scrolled / 500}`;
        }
    });
}
// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar)
        return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        }
        else {
            navbar.classList.remove('scrolled');
        }
    });
}
// Smooth scroll for scroll indicator
function initScrollIndicator() {
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
function initParticles() {
    const hero = document.querySelector('.hero');
    if (!hero)
        return;
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
    if (!ctx)
        return;
    const particles = [];
    const particleCount = 50;
    function resizeCanvas() {
        if (hero) {
            canvas.width = hero.clientWidth;
            canvas.height = hero.clientHeight;
        }
    }
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2
        };
    }
    function initParticlesArray() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle());
        }
    }
    function animate() {
        if (!ctx)
            return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((particle, index) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            if (particle.x < 0 || particle.x > canvas.width)
                particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height)
                particle.speedY *= -1;
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
function initScrollProgress() {
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
function initStaggeredAnimations() {
    const cards = document.querySelectorAll('.feature-card, .doc-card, .framework-badge');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}
// Cursor trail effect
function initCursorTrail() {
    const trail = [];
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
function initConfetti() {
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            createConfetti(e);
        });
    });
}
function createConfetti(e) {
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
function initPageTransitions() {
    document.body.classList.add('page-transition');
    // Add transition class to main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.classList.add('page-transition');
    }
}
// Magnetic button effect
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        const btnElement = button;
        btnElement.classList.add('btn-magnetic');
        btnElement.addEventListener('mousemove', (e) => {
            const mouseEvent = e;
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
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle)
        return;
    const text = heroTitle.textContent || '';
    if (text.length > 20)
        return; // Only for short titles
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid white';
    heroTitle.style.animation = 'blink 1s infinite';
    let index = 0;
    const typeInterval = setInterval(() => {
        if (index < text.length) {
            heroTitle.textContent += text[index];
            index++;
        }
        else {
            clearInterval(typeInterval);
            setTimeout(() => {
                heroTitle.style.borderRight = 'none';
            }, 1000);
        }
    }, 100);
}
// Initialize all functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
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
});
// Make copyCode available globally for inline onclick handlers
window.copyCode = function (button) {
    const codeBlock = button.closest('.code-block');
    const codeElement = codeBlock?.querySelector('code');
    if (codeElement) {
        const text = codeElement.textContent || '';
        navigator.clipboard.writeText(text).then(() => {
            const originalText = button.textContent;
            if (originalText) {
                button.textContent = 'Copied!';
                button.style.background = '#10b981';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '';
                }, 2000);
            }
        }).catch((err) => {
            console.error('Failed to copy:', err);
        });
    }
};
//# sourceMappingURL=main.js.map