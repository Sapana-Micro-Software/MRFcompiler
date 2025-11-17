export declare class HeroCanvas {
    private canvas;
    private ctx;
    private particles;
    private waves;
    private mouseX;
    private mouseY;
    private animationId;
    private particleCount;
    private colors;
    constructor(canvasId: string);
    private init;
    private resizeCanvas;
    private createParticles;
    private setupEventListeners;
    private createWave;
    private createParticleBurst;
    private updateParticles;
    private updateWaves;
    private draw;
    private animate;
    destroy(): void;
}
//# sourceMappingURL=hero-canvas.d.ts.map