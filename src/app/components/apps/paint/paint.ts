import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paint',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paint.html',
  styleUrl: './paint.scss',
})
export class Paint implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  
  selectedColor = '#000000';
  lineWidth = 2;
  
  colors = ['#000000', '#787878', '#790300', '#757a01', '#007902', '#007778', '#04007b', '#7b0077', '#767a38', '#003637', '#286ffe', '#0800f6', '#7600f5', '#ffffff', '#bbbbbb', '#ff0e00', '#fbfd00', '#00ff00', '#00feff', '#0000ff', '#ff00ff', '#ffff00', '#00ff80', '#80ffff', '#8080ff', '#ff80ff', '#ff8080'];

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    // Set canvas size to match container or default
    const parentWidth = canvas.parentElement?.clientWidth || 0;
    const parentHeight = canvas.parentElement?.clientHeight || 0;
    
    canvas.width = parentWidth > 0 ? parentWidth - 40 : 600; // Subtract padding
    canvas.height = parentHeight > 0 ? parentHeight - 40 : 400;
    
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  startDrawing(event: MouseEvent) {
    this.isDrawing = true;
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    // Draw a dot for single click
    this.ctx.fillStyle = this.selectedColor;
    this.ctx.fillRect(x - this.lineWidth/2, y - this.lineWidth/2, this.lineWidth, this.lineWidth);
  }

  draw(event: MouseEvent) {
    if (!this.isDrawing) return;
    
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = this.selectedColor;
    
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
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
}

