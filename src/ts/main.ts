// MRF Compiler Website - Main TypeScript
// Copyright (C) 2025, Shyamal Suhana Chandra

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
    button.addEventListener('click', async (e: Event) => {
      const btn = e.currentTarget as HTMLButtonElement;
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
        } catch (err) {
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
function initInstallationTabs(): void {
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
function initSmoothScroll(): void {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e: Event) {
      e.preventDefault();
      const href = (this as HTMLAnchorElement).getAttribute('href');
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
  document.querySelectorAll('.feature-card, .doc-card, .example-card').forEach((el) => {
    observer.observe(el);
  });
}

// Initialize all functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCodeCopy();
  initInstallationTabs();
  initSmoothScroll();
  initScrollAnimations();
});

// Export for use in other scripts
declare global {
  interface Window {
    copyCode: (button: HTMLButtonElement) => void;
  }
}

// Make copyCode available globally for inline onclick handlers
window.copyCode = function(button: HTMLButtonElement): void {
  const codeBlock = button.closest('.code-block');
  const codeElement = codeBlock?.querySelector('code');
  
  if (codeElement) {
    const text = codeElement.textContent || '';
    navigator.clipboard.writeText(text).then(() => {
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.style.background = '#10b981';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
      }, 2000);
    }).catch((err) => {
      console.error('Failed to copy:', err);
    });
  }
};
