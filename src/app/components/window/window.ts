import { Component, Input, inject, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragEnd } from '@angular/cdk/drag-drop';
import { SystemStateService, WindowInstance } from '../../services/system-state';
import { Paint } from '../apps/paint/paint';
import { VideoPlayer } from '../apps/video-player/video-player';
import { Connect } from '../apps/connect/connect';
import { RecycleBin } from '../apps/recycle-bin/recycle-bin';
import { Browser } from '../apps/browser/browser';
import { Projects } from '../apps/projects/projects';
import { Resume } from '../apps/resume/resume';
import { Experience } from '../apps/experience/experience';
import { Services } from '../apps/services/services';

@Component({
  selector: 'app-window',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './window.html',
  styleUrl: './window.scss',
})
export class Window {
  @Input({ required: true }) windowInstance!: WindowInstance;
  
  systemState = inject(SystemStateService);

  getComponent(appId: string): Type<any> | null {
    // console.log('Getting component for:', appId);
    switch (appId) {
      case 'paint': return Paint;
      case 'video': return VideoPlayer;
      case 'connect': return Connect;
      case 'recycle': return RecycleBin;
      case 'browser': return Browser;
      case 'projects': return Projects;
      case 'resume': return Resume;
      case 'experience': return Experience;
      case 'services': return Services;
      default: return null;
    }
  }

  onDragEnd(event: CdkDragEnd) {
    const { x, y } = event.source.getFreeDragPosition();
    this.systemState.updateWindowPosition(this.windowInstance.id, { x, y });
  }

  // Resizing Logic
  private isResizing = false;
  private resizeStartPos = { x: 0, y: 0 };
  private resizeStartSize = { width: 0, height: 0 };
  private resizeDirection = '';

  onResizeStart(event: MouseEvent, direction: string) {
    event.preventDefault();
    event.stopPropagation();
    this.isResizing = true;
    this.resizeDirection = direction;
    this.resizeStartPos = { x: event.clientX, y: event.clientY };
    this.resizeStartSize = { ...this.windowInstance.size };
    
    document.addEventListener('mousemove', this.onResizeMove);
    document.addEventListener('mouseup', this.onResizeEnd);
  }

  private onResizeMove = (event: MouseEvent) => {
    if (!this.isResizing) return;
    
    const dx = event.clientX - this.resizeStartPos.x;
    const dy = event.clientY - this.resizeStartPos.y;
    
    let newWidth = this.resizeStartSize.width;
    let newHeight = this.resizeStartSize.height;
    
    if (this.resizeDirection.includes('e')) {
      newWidth = Math.max(200, this.resizeStartSize.width + dx);
    }
    if (this.resizeDirection.includes('s')) {
      newHeight = Math.max(150, this.resizeStartSize.height + dy);
    }
    
    this.systemState.updateWindowSize(this.windowInstance.id, { width: newWidth, height: newHeight });
  }

  private onResizeEnd = () => {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.onResizeMove);
    document.removeEventListener('mouseup', this.onResizeEnd);
  }

  ngOnInit() {
    console.log('Window created:', this.windowInstance);
  }

  onFocus() {
    this.systemState.focusWindow(this.windowInstance.id);
  }

  minimize() {
    this.systemState.minimizeWindow(this.windowInstance.id);
  }

  maximize() {
    this.systemState.maximizeWindow(this.windowInstance.id);
  }

  close() {
    this.systemState.closeWindow(this.windowInstance.id);
  }
}

