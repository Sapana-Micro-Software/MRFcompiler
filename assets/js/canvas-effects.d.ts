export declare class QuantumCanvas {
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
export declare class QuantumCircuitCanvas {
    private canvas;
    private ctx;
    private qubits;
    private gates;
    private time;
    private animationId;
    constructor(canvasId: string);
    private init;
    private resizeCanvas;
    private generateRandomCircuit;
    private draw;
    private animate;
    destroy(): void;
}
//# sourceMappingURL=canvas-effects.d.ts.map