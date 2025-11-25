import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemStateService } from '../../services/system-state';

@Component({
  selector: 'app-taskbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './taskbar.html',
  styleUrl: './taskbar.scss',
})
export class Taskbar implements OnInit, OnDestroy {
  systemState = inject(SystemStateService);
  currentTime = new Date();
  private timer: any;

  ngOnInit() {
    this.timer = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  toggleStartMenu() {
    this.systemState.toggleStartMenu();
  }

  onTaskClick(windowId: string) {
    const win = this.systemState.windows().find(w => w.id === windowId);
    if (win) {
      if (win.isMinimized) {
        this.systemState.focusWindow(windowId);
      } else if (this.systemState.activeWindowId() === windowId) {
        this.systemState.minimizeWindow(windowId);
      } else {
        this.systemState.focusWindow(windowId);
      }
    }
  }
}

