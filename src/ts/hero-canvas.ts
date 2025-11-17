// Enhanced Hero Section Canvas Animation
// Copyright (C) 2025, Shyamal Suhana Chandra

export class HeroCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Array<{
    x: number;
    y: number;
    radius: number;
    speedX: number;
    speedY: number;
    opacity: number;
    color: string;
    trail: Array<{ x: number; y: number; opacity: number }>;
  }> = [];
  private waves: Array<{
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    speed: number;
    opacity: number;
    color: string;
  }> = [];
  private mouseX: number = 0;
  private mouseY: number = 0;
  private animationId: number | null = null;
  private particleCount: number = 150;
  private colors: string[] = ['#ffffff', '#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

  constructor(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas element with id "${canvasId}" not found`);
    }

    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context from canvas');
    }

    this.ctx = ctx;
    this.init();
  }

  private init(): void {
    this.resizeCanvas();
    this.createParticles();
    this.setupEventListeners();
    this.animate();
  }

  private resizeCanvas(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  private createParticles(): void {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.6 + 0.2,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        trail: []
      });
    }
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createParticles();
    });

    this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;

      if (Math.random() > 0.95) {
        this.createWave(this.mouseX, this.mouseY);
      }
    });

    this.canvas.addEventListener('click', (e: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.createWave(x, y);
      this.createParticleBurst(x, y);
    });
  }

  private createWave(x: number, y: number): void {
    const colors = ['#ffffff', '#6366f1', '#8b5cf6'];
    this.waves.push({
      x,
      y,
      radius: 0,
      maxRadius: Math.random() * 300 + 200,
      speed: Math.random() * 4 + 3,
      opacity: 0.8,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  private createParticleBurst(x: number, y: number): void {
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30;
      const speed = Math.random() * 8 + 4;
      this.particles.push({
        x,
        y,
        radius: Math.random() * 3 + 1,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        opacity: Math.random() * 0.9 + 0.1,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        trail: []
      });
    }
  }

  private updateParticles(): void {
    this.particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      particle.trail.push({ x: particle.x, y: particle.y, opacity: particle.opacity });
      if (particle.trail.length > 15) {
        particle.trail.shift();
      }

      const dx = particle.x - this.mouseX;
      const dy = particle.y - this.mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const force = (150 - distance) / 150;
        particle.speedX += (dx / distance) * force * 0.08;
        particle.speedY += (dy / distance) * force * 0.08;
      }

      if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;

      particle.speedX *= 0.98;
      particle.speedY *= 0.98;

      if (this.particles.length > this.particleCount * 2) {
        if (particle.x < -100 || particle.x > this.canvas.width + 100 ||
            particle.y < -100 || particle.y > this.canvas.height + 100) {
          this.particles.splice(index, 1);
        }
      }
    });
  }

  private updateWaves(): void {
    this.waves = this.waves.filter(wave => {
      wave.radius += wave.speed;
      wave.opacity -= 0.015;
      return wave.radius < wave.maxRadius && wave.opacity > 0;
    });
  }

  private draw(): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.waves.forEach(wave => {
      const gradient = this.ctx.createRadialGradient(
        wave.x, wave.y, 0,
        wave.x, wave.y, wave.radius
      );
      gradient.addColorStop(0, `${wave.color}${Math.floor(wave.opacity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${wave.color}00`);

      this.ctx.beginPath();
      this.ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
    });

    this.particles.forEach((particle, index) => {
      this.particles.slice(index + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          const opacity = (1 - distance / 120) * 0.4;
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          this.ctx.lineWidth = 1.5;
          this.ctx.stroke();
        }
      });
    });

    this.particles.forEach(particle => {
      particle.trail.forEach((point, trailIndex) => {
        const trailOpacity = (trailIndex / particle.trail.length) * particle.opacity * 0.4;
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, particle.radius * 0.6, 0, Math.PI * 2);
        this.ctx.fillStyle = `${particle.color}${Math.floor(trailOpacity * 255).toString(16).padStart(2, '0')}`;
        this.ctx.fill();
      });
    });

    this.particles.forEach(particle => {
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius * 4
      );
      gradient.addColorStop(0, `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${particle.color}00`);

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();
    });
  }

  private animate(): void {
    this.updateParticles();
    this.updateWaves();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  public destroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    this.particles = [];
    this.waves = [];
  }
}
