import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paint',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paint.html',
  styleUrl: './paint.scss',
})
export class Paint implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private resizeObserver!: ResizeObserver;
  
  selectedColor = '#000000';
  lineWidth = 2;
  currentTool: 'pencil' | 'eraser' | 'brush' | 'line' | 'rect' | 'circle' = 'pencil';
  startX = 0;
  startY = 0;
  snapshot: ImageData | null = null;
  
  colors = ['#000000', '#787878', '#790300', '#757a01', '#007902', '#007778', '#04007b', '#7b0077', '#767a38', '#003637', '#286ffe', '#0800f6', '#7600f5', '#ffffff', '#bbbbbb', '#ff0e00', '#fbfd00', '#00ff00', '#00feff', '#0000ff', '#ff00ff', '#ffff00', '#00ff80', '#80ffff', '#8080ff', '#ff80ff', '#ff8080'];

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
    if (canvas.parentElement) {
      this.resizeObserver.observe(canvas.parentElement);
    }
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement;
    if (!parent) return;

    const newWidth = parent.clientWidth - 20;
    const newHeight = parent.clientHeight - 20;

    if (newWidth <= 0 || newHeight <= 0) return;
    if (canvas.width === newWidth && canvas.height === newHeight) return;

    // Save existing content
    let imageData: ImageData | null = null;
    if (canvas.width > 0 && canvas.height > 0) {
      imageData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    canvas.width = newWidth;
    canvas.height = newHeight;

    // Restore context properties
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = this.lineWidth;
    
    // Fill white background
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Restore content
    if (imageData) {
      this.ctx.putImageData(imageData, 0, 0);
    }
  }

  setTool(tool: string) {
    this.currentTool = tool as any;
    if (tool === 'brush') this.lineWidth = 8;
    else if (tool === 'pencil') this.lineWidth = 2;
    else if (tool === 'eraser') this.lineWidth = 10;
  }

  setSize(size: number) {
    this.lineWidth = size;
  }

  startDrawing(event: MouseEvent) {
    this.isDrawing = true;
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.startX = event.clientX - rect.left;
    this.startY = event.clientY - rect.top;
    
    this.ctx.beginPath();
    
    if (['line', 'rect', 'circle'].includes(this.currentTool)) {
      this.snapshot = this.ctx.getImageData(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    } else {
      this.ctx.moveTo(this.startX, this.startY);
      // Draw a dot for single click
      this.ctx.fillStyle = this.currentTool === 'eraser' ? '#ffffff' : this.selectedColor;
      this.ctx.fillRect(this.startX - this.lineWidth/2, this.startY - this.lineWidth/2, this.lineWidth, this.lineWidth);
    }
  }

  draw(event: MouseEvent) {
    if (!this.isDrawing) return;
    
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (['line', 'rect', 'circle'].includes(this.currentTool)) {
      this.ctx.putImageData(this.snapshot!, 0, 0);
      this.ctx.beginPath();
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.strokeStyle = this.selectedColor;
      
      if (this.currentTool === 'line') {
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(x, y);
      } else if (this.currentTool === 'rect') {
        this.ctx.strokeRect(this.startX, this.startY, x - this.startX, y - this.startY);
        return; 
      } else if (this.currentTool === 'circle') {
        const radius = Math.sqrt(Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2));
        this.ctx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
      }
      this.ctx.stroke();
    } else {
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.strokeStyle = this.currentTool === 'eraser' ? '#ffffff' : this.selectedColor;
      
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
    }
  }

  stopDrawing() {
    this.isDrawing = false;
    this.ctx.beginPath();
  }
  
  selectColor(color: string) {
    this.selectedColor = color;
  }
  
  clear() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  save() {
    const link = document.createElement('a');
    link.download = 'my-painting.png';
    link.href = this.canvasRef.nativeElement.toDataURL();
    link.click();
  }
}

