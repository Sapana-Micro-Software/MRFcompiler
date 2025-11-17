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
    
    // Wait for canvas to be fully ready
    requestAnimationFrame(() => {
      this.animate();
    });
  }

  private resizeCanvas(): void {
    if (!this.canvas) return;
    
    const rect = this.canvas.getBoundingClientRect();
    // Use device pixel ratio for crisp rendering on high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
      // Reset canvas style to maintain visual size
      this.canvas.style.width = rect.width + 'px';
      this.canvas.style.height = rect.height + 'px';
    }
  }

  private createParticles(): void {
    if (!this.canvas) return;
    this.particles = [];
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
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
    if (!this.canvas) return;
    
    const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);
    
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
      if (particle.x < 0 || particle.x > canvasWidth) {
        particle.speedX *= -1;
        particle.x = Math.max(0, Math.min(canvasWidth, particle.x));
      }
      if (particle.y < 0 || particle.y > canvasHeight) {
        particle.speedY *= -1;
        particle.y = Math.max(0, Math.min(canvasHeight, particle.y));
      }

      // Damping
      particle.speedX *= 0.99;
      particle.speedY *= 0.99;

      // Remove particles that are too far out
      if (particle.x < -50 || particle.x > canvasWidth + 50 ||
          particle.y < -50 || particle.y > canvasHeight + 50) {
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
    if (!this.canvas || !this.ctx) return;
    
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    
    // Clear with fade effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, width, height);

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
    if (!this.canvas || !this.ctx) {
      if (this.animationId !== null) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      return;
    }
    
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
    
    // Wait for canvas to be fully ready
    requestAnimationFrame(() => {
      this.animate();
    });
    
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      // Regenerate circuit on resize for better layout
      this.generateRandomCircuit();
    });
  }

  private resizeCanvas(): void {
    if (!this.canvas) return;
    
    const rect = this.canvas.getBoundingClientRect();
    // Use device pixel ratio for crisp rendering on high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
      // Reset canvas style to maintain visual size
      this.canvas.style.width = rect.width + 'px';
      this.canvas.style.height = rect.height + 'px';
    }
  }

  private generateRandomCircuit(): void {
    this.gates = [];
    const singleQubitGates = ['H', 'X', 'Y', 'Z', 'RY', 'RZ'];
    const twoQubitGates = ['CNOT', 'CZ'];
    
    // Generate a more realistic circuit with variety
    let timeStep = 0;
    for (let i = 0; i < 30; i++) {
      let gateType: string;
      let qubit: number;
      
      // 30% chance of two-qubit gate
      if (Math.random() < 0.3 && this.qubits > 1) {
        gateType = twoQubitGates[Math.floor(Math.random() * twoQubitGates.length)];
        qubit = Math.floor(Math.random() * (this.qubits - 1)); // Control qubit
      } else {
        gateType = singleQubitGates[Math.floor(Math.random() * singleQubitGates.length)];
        qubit = Math.floor(Math.random() * this.qubits);
      }
      
      this.gates.push({
        type: gateType,
        qubit: qubit,
        time: timeStep
      });
      
      // Variable time steps for more realistic circuit
      timeStep += Math.random() * 2 + 1;
    }
    
    // Sort gates by time for better visualization
    this.gates.sort((a, b) => a.time - b.time);
  }

  private draw(): void {
    if (!this.canvas || !this.ctx) return;

    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    
    this.ctx.clearRect(0, 0, width, height);

    const padding = 40;
    const qubitSpacing = (height - padding * 2) / Math.max(1, this.qubits - 1);
    const timeStep = 30;
    
    if (this.gates.length === 0) {
      // Draw placeholder message if no gates
      this.ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
      this.ctx.font = '20px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('Quantum Circuit Visualizer', width / 2, height / 2);
      return;
    }
    
    const maxTime = Math.max(...this.gates.map(g => g.time)) + 5;

    // Draw qubit lines
    for (let i = 0; i < this.qubits; i++) {
      const y = padding + i * qubitSpacing;
      this.ctx.beginPath();
      this.ctx.moveTo(padding, y);
      this.ctx.lineTo(width - padding, y);
      this.ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }

    // Draw gates
    this.gates.forEach(gate => {
      const x = padding + (gate.time / maxTime) * (width - padding * 2);
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
      this.ctx.font = 'bold 12px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(gate.type, x, y);
      
      // Draw connection lines for two-qubit gates
      if (gate.type === 'CNOT' || gate.type === 'CZ') {
        const targetQubit = Math.min(gate.qubit + 1, this.qubits - 1);
        const targetY = padding + targetQubit * qubitSpacing;
        
        // Control dot (filled circle)
        this.ctx.beginPath();
        this.ctx.arc(x, y, 6, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ec4899';
        this.ctx.fill();
        
        // Connection line (vertical)
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, targetY);
        this.ctx.strokeStyle = 'rgba(236, 72, 153, 0.6)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Target gate (circle for CNOT, filled for CZ)
        if (gate.type === 'CNOT') {
          this.ctx.beginPath();
          this.ctx.arc(x, targetY, 10, 0, Math.PI * 2);
          this.ctx.strokeStyle = '#ec4899';
          this.ctx.lineWidth = 2;
          this.ctx.stroke();
          // Plus sign for CNOT
          this.ctx.strokeStyle = '#ec4899';
          this.ctx.lineWidth = 2;
          this.ctx.beginPath();
          this.ctx.moveTo(x - 5, targetY);
          this.ctx.lineTo(x + 5, targetY);
          this.ctx.moveTo(x, targetY - 5);
          this.ctx.lineTo(x, targetY + 5);
          this.ctx.stroke();
        } else {
          // CZ gate (filled circle)
          this.ctx.beginPath();
          this.ctx.arc(x, targetY, 8, 0, Math.PI * 2);
          this.ctx.fillStyle = '#ec4899';
          this.ctx.fill();
        }
      }
    });

    // Draw animation progress
    const progressX = padding + (this.time / maxTime) * (width - padding * 2);
    this.ctx.beginPath();
    this.ctx.moveTo(progressX, padding);
    this.ctx.lineTo(progressX, height - padding);
    this.ctx.strokeStyle = '#ec4899';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
  }

  private animate(): void {
    if (!this.canvas || !this.ctx) {
      if (this.animationId !== null) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      return;
    }
    
    this.time += 0.1;
    if (this.gates.length > 0) {
      const maxTime = Math.max(...this.gates.map(g => g.time)) + 5;
      if (this.time > maxTime) {
        this.time = 0;
      }
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
