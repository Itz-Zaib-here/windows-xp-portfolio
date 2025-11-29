import { Injectable, signal, WritableSignal } from '@angular/core';

export type BootState = 'booting' | 'login' | 'desktop' | 'shutdown' | 'blank';

export interface WindowInstance {
  id: string;
  appId: string;
  title: string;
  icon: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class SystemStateService {
  bootState: WritableSignal<BootState> = signal('booting');
  windows: WritableSignal<WindowInstance[]> = signal([]);
  activeWindowId: WritableSignal<string | null> = signal(null);
  startMenuOpen: WritableSignal<boolean> = signal(false);

  private zIndexCounter = 100;

  openWindow(appId: string, title: string, icon: string, data?: any, size?: { width: number, height: number }) {
    const id = Math.random().toString(36).substring(7);
    const newWindow: WindowInstance = {
      id,
      appId,
      title,
      icon,
      isMinimized: false,
      isMaximized: false,
      zIndex: ++this.zIndexCounter,
      position: { x: 100 + (this.windows().length * 20), y: 100 + (this.windows().length * 20) },
      size: size || { width: 700, height: 400 },
      data
    };
    
    this.windows.update(w => [...w, newWindow]);
    this.focusWindow(id);
  }

  closeWindow(id: string) {
    this.windows.update(w => w.filter(window => window.id !== id));
  }

  minimizeWindow(id: string) {
    this.windows.update(w => w.map(window => 
      window.id === id ? { ...window, isMinimized: true } : window
    ));
  }

  maximizeWindow(id: string) {
    this.windows.update(w => w.map(window => 
      window.id === id ? { ...window, isMaximized: !window.isMaximized } : window
    ));
  }

  updateWindowPosition(id: string, position: { x: number, y: number }) {
    this.windows.update(w => w.map(window => 
      window.id === id ? { ...window, position } : window
    ));
  }

  updateWindowSize(id: string, size: { width: number, height: number }) {
    this.windows.update(w => w.map(window => 
      window.id === id ? { ...window, size } : window
    ));
  }

  focusWindow(id: string) {
    this.activeWindowId.set(id);
    this.windows.update(w => w.map(window => 
      window.id === id ? { ...window, zIndex: ++this.zIndexCounter, isMinimized: false } : window
    ));
  }

  toggleStartMenu() {
    this.startMenuOpen.update(v => !v);
  }

  closeStartMenu() {
    this.startMenuOpen.set(false);
  }
}

