// Enhanced Canvas Effects for MRF Compiler Website
// Copyright (C) 2025, Shyamal Suhana Chandra

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  trail: Array<{ x: number; y: number }>;
}

interface Wave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  opacity: number;
}

export class QuantumCanvas {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private waves: Wave[] = [];
  private mouseX: number = 0;
  private mouseY: number = 0;
  private animationId: number | null = null;
  private particleCount: number = 100;
  private colors: string[] = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

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
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
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
      
      // Create wave on mouse move
      if (Math.random() > 0.9) {
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
    this.waves.push({
      x,
      y,
      radius: 0,
      maxRadius: Math.random() * 200 + 100,
      speed: Math.random() * 3 + 2,
      opacity: 0.6
    });
  }

  private createParticleBurst(x: number, y: number): void {
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const speed = Math.random() * 5 + 2;
      this.particles.push({
        x,
        y,
        radius: Math.random() * 2 + 1,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        opacity: Math.random() * 0.8 + 0.2,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        trail: []
      });
    }
  }

  private updateParticles(): void {
    this.particles.forEach((particle, index) => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Add to trail
      particle.trail.push({ x: particle.x, y: particle.y });
      if (particle.trail.length > 10) {
        particle.trail.shift();
      }

      // Mouse interaction
      const dx = particle.x - this.mouseX;
      const dy = particle.y - this.mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.speedX += (dx / distance) * force * 0.05;
        particle.speedY += (dy / distance) * force * 0.05;
      }

      // Boundary collision
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.speedX *= -1;
        particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.speedY *= -1;
        particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
      }

      // Damping
      particle.speedX *= 0.99;
      particle.speedY *= 0.99;

      // Remove particles that are too far out
      if (particle.x < -50 || particle.x > this.canvas.width + 50 ||
          particle.y < -50 || particle.y > this.canvas.height + 50) {
        if (this.particles.length > this.particleCount) {
          this.particles.splice(index, 1);
        }
      }
    });
  }

  private updateWaves(): void {
    this.waves = this.waves.filter(wave => {
      wave.radius += wave.speed;
      wave.opacity -= 0.02;
      return wave.radius < wave.maxRadius && wave.opacity > 0;
    });
  }

  private draw(): void {
    // Clear with fade effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw waves
    this.waves.forEach(wave => {
      this.ctx.beginPath();
      this.ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(99, 102, 241, ${wave.opacity})`;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    });

    // Draw particle connections
    this.particles.forEach((particle, index) => {
      this.particles.slice(index + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const opacity = (1 - distance / 150) * 0.3;
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      });
    });

    // Draw particle trails
    this.particles.forEach(particle => {
      particle.trail.forEach((point, trailIndex) => {
        const trailOpacity = (trailIndex / particle.trail.length) * particle.opacity * 0.5;
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, particle.radius * 0.5, 0, Math.PI * 2);
        this.ctx.fillStyle = `${particle.color}${Math.floor(trailOpacity * 255).toString(16).padStart(2, '0')}`;
        this.ctx.fill();
      });
    });

    // Draw particles
    this.particles.forEach(particle => {
      // Glow effect
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius * 3
      );
      gradient.addColorStop(0, `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${particle.color}00`);

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();

      // Main particle
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

// Interactive quantum circuit visualizer
export class QuantumCircuitCanvas {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private qubits: number = 5;
  private gates: Array<{ type: string; qubit: number; time: number }> = [];
  private time: number = 0;
  private animationId: number | null = null;

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
    this.generateRandomCircuit();
    this.animate();
    
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
  }

  private resizeCanvas(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  private generateRandomCircuit(): void {
    this.gates = [];
    const gateTypes = ['H', 'X', 'Y', 'Z', 'CNOT', 'CZ'];
    
    for (let i = 0; i < 20; i++) {
      this.gates.push({
        type: gateTypes[Math.floor(Math.random() * gateTypes.length)],
        qubit: Math.floor(Math.random() * this.qubits),
        time: i * 2
      });
    }
  }

  private draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const padding = 40;
    const qubitSpacing = (this.canvas.height - padding * 2) / (this.qubits - 1);
    const timeStep = 30;
    const maxTime = Math.max(...this.gates.map(g => g.time)) + 5;

    // Draw qubit lines
    for (let i = 0; i < this.qubits; i++) {
      const y = padding + i * qubitSpacing;
      this.ctx.beginPath();
      this.ctx.moveTo(padding, y);
      this.ctx.lineTo(this.canvas.width - padding, y);
      this.ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }

    // Draw gates
    this.gates.forEach(gate => {
      const x = padding + (gate.time / maxTime) * (this.canvas.width - padding * 2);
      const y = padding + gate.qubit * qubitSpacing;

      // Gate glow
      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 25);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, 25, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();

      // Gate box
      this.ctx.fillStyle = '#6366f1';
      this.ctx.fillRect(x - 20, y - 15, 40, 30);
      
      // Gate label
      this.ctx.fillStyle = 'white';
      this.ctx.font = 'bold 14px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(gate.type, x, y);
    });

    // Draw animation progress
    const progressX = padding + (this.time / maxTime) * (this.canvas.width - padding * 2);
    this.ctx.beginPath();
    this.ctx.moveTo(progressX, padding);
    this.ctx.lineTo(progressX, this.canvas.height - padding);
    this.ctx.strokeStyle = '#ec4899';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
  }

  private animate(): void {
    this.time += 0.1;
    const maxTime = Math.max(...this.gates.map(g => g.time)) + 5;
    if (this.time > maxTime) {
      this.time = 0;
    }
    
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  public destroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
