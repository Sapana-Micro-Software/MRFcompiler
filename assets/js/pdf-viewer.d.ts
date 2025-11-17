export interface PDFInfo {
    title: string;
    description: string;
    url: string;
    icon: string;
    type: 'paper' | 'presentation' | 'reference';
}
export declare class PDFViewer {
    private modal;
    private iframe;
    private currentPDF;
    constructor();
    private createModal;
    private setupEventListeners;
    open(pdfInfo: PDFInfo): void;
    close(): void;
}
export declare class PDFCard {
    private card;
    private pdfInfo;
    private viewer;
    private canvas;
    private ctx;
    private animationId;
    constructor(card: HTMLElement, pdfInfo: PDFInfo, viewer: PDFViewer);
    private init;
    private createCanvas;
    private resizeCanvas;
    private setupEventListeners;
    private animate;
    destroy(): void;
}
//# sourceMappingURL=pdf-viewer.d.ts.map