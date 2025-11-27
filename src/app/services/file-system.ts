import { Injectable, signal, WritableSignal, effect } from '@angular/core';

export interface DesktopIcon {
  id: string;
  title: string;
  icon: string;
  type: 'link' | 'app' | 'none' | 'folder';
  url?: string;
  position: { x: number; y: number };
  isRenaming?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FileSystemService {
  desktopIcons: WritableSignal<DesktopIcon[]> = signal([]);
  recycleBinItems: WritableSignal<DesktopIcon[]> = signal([]);

  private readonly STORAGE_KEY_DESKTOP = 'xp_desktop_icons';
  private readonly STORAGE_KEY_RECYCLE = 'xp_recycle_bin';

  constructor() {
    this.loadFromStorage();
    
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY_DESKTOP, JSON.stringify(this.desktopIcons()));
    });

    effect(() => {
      localStorage.setItem(this.STORAGE_KEY_RECYCLE, JSON.stringify(this.recycleBinItems()));
    });
  }

  private loadFromStorage() {
    const storedDesktop = localStorage.getItem(this.STORAGE_KEY_DESKTOP);
    const storedRecycle = localStorage.getItem(this.STORAGE_KEY_RECYCLE);

    if (storedDesktop) {
      this.desktopIcons.set(JSON.parse(storedDesktop));
    } else {
      this.initializeDefaultIcons();
    }

    if (storedRecycle) {
      this.recycleBinItems.set(JSON.parse(storedRecycle));
    }

    // Ensure new default apps appear even if storage exists
    this.ensureDefaultIconsExist();
  }

  private ensureDefaultIconsExist() {
    const defaults = this.getDefaultIcons();
    const currentDesktop = [...this.desktopIcons()];
    const currentRecycle = this.recycleBinItems();
    
    const missing = defaults.filter(def => 
      !currentDesktop.some(i => i.id === def.id) && 
      !currentRecycle.some(i => i.id === def.id)
    );

    if (missing.length > 0) {
      missing.forEach(icon => {
        icon.position = this.findNextFreePosition(currentDesktop);
        currentDesktop.push(icon);
      });
      this.desktopIcons.set(currentDesktop);
    }
  }

  private findNextFreePosition(currentIcons: DesktopIcon[]): { x: number, y: number } {
    const startX = 10;
    const startY = 10;
    const gapX = 90;
    const gapY = 90;
    const maxY = typeof window !== 'undefined' ? window.innerHeight - 80 : 600;

    let col = 0;
    let row = 0;
    let iterations = 0;

    while (iterations < 200) {
      const x = startX + (col * gapX);
      const y = startY + (row * gapY);

      const isOccupied = currentIcons.some(icon => 
        Math.abs(icon.position.x - x) < 45 && Math.abs(icon.position.y - y) < 45
      );

      if (!isOccupied) {
        return { x, y };
      }

      row++;
      if ((startY + (row * gapY)) > maxY) {
        row = 0;
        col++;
      }
      iterations++;
    }
    return { x: 10, y: 10 };
  }

  private getDefaultIcons(): DesktopIcon[] {
    return [
      { id: 'projects', title: 'Projects', icon: 'assets/icons/folder.png', type: 'app', url: 'https://github.com/Itz-Zaib-here', position: { x: 10, y: 10 } },
      { id: 'experience', title: 'Experience', icon: 'assets/icons/folder.png', type: 'app', position: { x: 10, y: 100 } },
      { id: 'services', title: 'Services', icon: 'assets/icons/folder.png', type: 'app', position: { x: 10, y: 190 } },
      { id: 'browser', title: 'Internet Explorer', icon: 'assets/icons/ie.png', type: 'link', url: 'https://google.com', position: { x: 10, y: 280 } },
      { id: 'resume', title: 'Resume', icon: 'assets/icons/notepad.png', type: 'app', position: { x: 10, y: 370 } },
      { id: 'paint', title: 'Paint', icon: 'assets/icons/paint.png', type: 'app', position: { x: 10, y: 460 } },
      { id: 'video', title: 'Media Player', icon: 'assets/icons/wmp.png', type: 'app', position: { x: 10, y: 550 } },
      { id: 'connect', title: 'Connect', icon: 'assets/icons/msn.png', type: 'app', position: { x: 10, y: 640 } },
      { id: 'recycle', title: 'Recycle Bin', icon: 'assets/icons/recycle.png', type: 'app', position: { x: 10, y: 730 } }
    ];
  }

  private initializeDefaultIcons() {
    this.desktopIcons.set(this.getDefaultIcons());
  }

  addIcon(icon: DesktopIcon) {
    this.desktopIcons.update(icons => [...icons, icon]);
  }

  updateIconPosition(id: string, position: { x: number; y: number }) {
    this.desktopIcons.update(icons => icons.map(i => i.id === id ? { ...i, position } : i));
  }

  setRenaming(id: string, isRenaming: boolean) {
    this.desktopIcons.update(icons => icons.map(i => i.id === id ? { ...i, isRenaming } : i));
  }

  renameIcon(id: string, newTitle: string) {
    this.desktopIcons.update(icons => icons.map(i => i.id === id ? { ...i, title: newTitle, isRenaming: false } : i));
  }

  moveToRecycleBin(id: string) {
    const icon = this.desktopIcons().find(i => i.id === id);
    if (icon && icon.id !== 'recycle') { // Prevent deleting Recycle Bin itself
      this.desktopIcons.update(icons => icons.filter(i => i.id !== id));
      this.recycleBinItems.update(items => [...items, icon]);
    }
  }

  restoreFromRecycleBin(id: string) {
    const icon = this.recycleBinItems().find(i => i.id === id);
    if (icon) {
      this.recycleBinItems.update(items => items.filter(i => i.id !== id));
      this.desktopIcons.update(icons => [...icons, icon]);
    }
  }

  deletePermanently(id: string) {
    this.recycleBinItems.update(items => items.filter(i => i.id !== id));
  }

  emptyRecycleBin() {
    this.recycleBinItems.set([]);
  }
}
