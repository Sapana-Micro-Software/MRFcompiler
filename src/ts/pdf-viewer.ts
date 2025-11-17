// PDF Viewer and Preview Component
// Copyright (C) 2025, Shyamal Suhana Chandra

export interface PDFInfo {
  title: string;
  description: string;
  url: string;
  icon: string;
  type: 'paper' | 'presentation' | 'reference';
}

export class PDFViewer {
  private modal: HTMLDivElement | null = null;
  private iframe: HTMLIFrameElement | null = null;
  private currentPDF: PDFInfo | null = null;

  constructor() {
    this.createModal();
    this.setupEventListeners();
  }

  private createModal(): void {
    this.modal = document.createElement('div');
    this.modal.id = 'pdf-modal';
    this.modal.className = 'pdf-modal';
    this.modal.innerHTML = `
      <div class="pdf-modal-content">
        <div class="pdf-modal-header">
          <h2 id="pdf-modal-title"></h2>
          <button class="pdf-modal-close" aria-label="Close PDF viewer">&times;</button>
        </div>
        <div class="pdf-modal-body">
          <iframe id="pdf-iframe" src="" frameborder="0"></iframe>
        </div>
        <div class="pdf-modal-footer">
          <a id="pdf-download-link" class="btn btn-primary" download>Download PDF</a>
          <button class="btn btn-secondary pdf-modal-close">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(this.modal);
  }

  private setupEventListeners(): void {
    if (!this.modal) return;
    
    const closeButtons = this.modal.querySelectorAll('.pdf-modal-close');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.close();
      });
    });

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
        this.close();
      }
    });
  }

  public open(pdfInfo: PDFInfo): void {
    if (!this.modal) {
      console.error('PDF modal not initialized');
      // Fallback: open PDF in new tab
      window.open(pdfInfo.url, '_blank');
      return;
    }

    this.currentPDF = pdfInfo;
    const titleEl = document.getElementById('pdf-modal-title');
    const iframeEl = document.getElementById('pdf-iframe') as HTMLIFrameElement;
    const downloadLink = document.getElementById('pdf-download-link') as HTMLAnchorElement;

    if (titleEl) titleEl.textContent = pdfInfo.title;
    if (iframeEl) {
      iframeEl.style.opacity = '0';
      iframeEl.src = pdfInfo.url;
      iframeEl.onload = () => {
        iframeEl.style.opacity = '1';
      };
      iframeEl.onerror = () => {
        console.error('Failed to load PDF:', pdfInfo.url);
        // Fallback: open in new tab
        window.open(pdfInfo.url, '_blank');
        this.close();
      };
    }
    if (downloadLink) {
      downloadLink.href = pdfInfo.url;
      downloadLink.download = pdfInfo.url.split('/').pop() || 'document.pdf';
    }

    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  public close(): void {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clear iframe source after animation
    setTimeout(() => {
      const iframeEl = document.getElementById('pdf-iframe') as HTMLIFrameElement;
      if (iframeEl) {
        iframeEl.src = '';
      }
    }, 300);
  }
}

export class PDFCard {
  private card: HTMLElement;
  private pdfInfo: PDFInfo;
  private viewer: PDFViewer;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationId: number | null = null;

  constructor(card: HTMLElement, pdfInfo: PDFInfo, viewer: PDFViewer) {
    this.card = card;
    this.pdfInfo = pdfInfo;
    this.viewer = viewer;
    this.init();
  }

  private init(): void {
    this.createCanvas();
    this.setupEventListeners();
    this.animate();
  }

  private createCanvas(): void {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'pdf-card-canvas';
    this.canvas.width = 200;
    this.canvas.height = 200;
    this.ctx = this.canvas.getContext('2d');
    
    const cardBody = this.card.querySelector('.doc-card-body') || this.card;
    cardBody.appendChild(this.canvas);
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas(): void {
    if (!this.canvas) return;
    const rect = this.card.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  private setupEventListeners(): void {
    this.card.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.viewer.open(this.pdfInfo);
    });

    this.card.addEventListener('mouseenter', () => {
      this.card.classList.add('hover');
    });

    this.card.addEventListener('mouseleave', () => {
      this.card.classList.remove('hover');
    });
    
    // Make card keyboard accessible
    this.card.setAttribute('tabindex', '0');
    this.card.setAttribute('role', 'button');
    this.card.setAttribute('aria-label', `View ${this.pdfInfo.title}`);
    
    this.card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.viewer.open(this.pdfInfo);
      }
    });
  }

  private animate(): void {
    if (!this.canvas || !this.ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    const particleCount = 20;
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const draw = () => {
      if (!this.canvas || !this.ctx) return;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (!this.canvas || !this.ctx) return;
        
        if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;

        const color = colors[index % colors.length];
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `${color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
        this.ctx.fill();

        // Connect nearby particles
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80 && this.ctx) {
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(otherParticle.x, otherParticle.y);
            this.ctx.strokeStyle = `${color}${Math.floor((1 - distance / 80) * 0.2 * 255).toString(16).padStart(2, '0')}`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
          }
        });
      });

      this.animationId = requestAnimationFrame(draw);
    };

    draw();
  }

  public destroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    this.canvas?.remove();
  }
}
