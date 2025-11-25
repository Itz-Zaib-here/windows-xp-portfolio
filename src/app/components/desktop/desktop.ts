import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DragDropModule, CdkDragEnd } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { Taskbar } from '../taskbar/taskbar';
import { StartMenu } from '../start-menu/start-menu';
import { Window } from '../window/window';
import { SystemStateService } from '../../services/system-state';
import { FileSystemService, DesktopIcon } from '../../services/file-system';

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule, Taskbar, StartMenu, Window],
  templateUrl: './desktop.html',
  styleUrl: './desktop.scss',
})
export class Desktop {
  systemState = inject(SystemStateService);
  fileSystem = inject(FileSystemService);
  private sanitizer = inject(DomSanitizer);
  
  startupSoundUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/7nQ2oiVqKHw?autoplay=1&controls=0&showinfo=0');

  contextMenuVisible = signal(false);
  contextMenuPosition = signal({ x: 0, y: 0 });
  refreshing = signal(false);
  contextMenuTargetId: string | null = null;

  handleIconClick(icon: DesktopIcon) {
    if (icon.isRenaming) return;
    
    if (icon.type === 'link' && icon.url) {
      // For now, open browser app instead of new tab if it's the browser icon
      if (icon.id === 'browser' || icon.id === 'projects' || icon.id === 'resume' || icon.id === 'experience' || icon.id === 'services') {
        this.systemState.openWindow(icon.id, icon.title, icon.icon);
      } else {
        window.open(icon.url, '_blank');
      }
    } else if (icon.type === 'app' || icon.type === 'folder') {
      // Treat folders as apps for now (or open explorer later)
      // For recycle bin, we open it as an app
      this.systemState.openWindow(icon.id, icon.title, icon.icon);
    }
  }

  onIconDragEnd(event: CdkDragEnd, icon: DesktopIcon) {
    const { x, y } = event.source.getFreeDragPosition();
    this.fileSystem.updateIconPosition(icon.id, { x, y });

    // Check if dropped on Recycle Bin
    // This is a simplified check. Ideally we'd use drop lists or intersection observers.
    // But since we have absolute positions, we can check if the drop coordinates are close to the Recycle Bin.
    const recycleBin = this.fileSystem.desktopIcons().find(i => i.id === 'recycle');
    if (recycleBin && icon.id !== 'recycle') {
      // Get the drop point relative to the viewport
      const dropPoint = event.source.getRootElement().getBoundingClientRect();
      
      // We need to know where the recycle bin is on screen. 
      // Since we are using absolute positioning for everything now, we can compare coordinates.
      // Assuming standard icon size ~80x80
      const rbX = recycleBin.position.x;
      const rbY = recycleBin.position.y;
      
      // Check for intersection
      if (
        dropPoint.x < rbX + 80 &&
        dropPoint.x + 80 > rbX &&
        dropPoint.y < rbY + 80 &&
        dropPoint.y + 80 > rbY
      ) {
        this.fileSystem.moveToRecycleBin(icon.id);
      }
    }
  }

  trackByWindowId(index: number, window: any): string {
    return window.id;
  }
  
  onDesktopClick(event: MouseEvent) {
    this.contextMenuVisible.set(false);
    if (this.systemState.startMenuOpen()) {
      if ((event.target as HTMLElement).classList.contains('desktop-container')) {
        this.systemState.closeStartMenu();
      }
    }
    
    // Stop renaming if clicking elsewhere
    this.fileSystem.desktopIcons().forEach(icon => {
      if (icon.isRenaming) {
        icon.isRenaming = false;
      }
    });
  }

  onContextMenu(event: MouseEvent, iconId?: string) {
    event.preventDefault();
    event.stopPropagation(); // Prevent bubbling if clicking on icon
    this.contextMenuTargetId = iconId || null;
    this.contextMenuPosition.set({ x: event.clientX, y: event.clientY });
    this.contextMenuVisible.set(true);
  }

  refresh() {
    this.contextMenuVisible.set(false);
    this.refreshing.set(true);
    setTimeout(() => {
      this.refreshing.set(false);
    }, 100);
  }

  arrangeIcons() {
    // Simple grid arrangement logic
    const icons = [...this.fileSystem.desktopIcons()];
    icons.sort((a, b) => a.title.localeCompare(b.title));
    
    let x = 10;
    let y = 10;
    const gap = 90;
    const maxHeight = window.innerHeight - 50; // Taskbar space

    icons.forEach(icon => {
      this.fileSystem.updateIconPosition(icon.id, { x, y });
      y += gap;
      if (y > maxHeight) {
        y = 10;
        x += gap;
      }
    });
    
    this.contextMenuVisible.set(false);
  }

  createNewFolder() {
    const count = this.fileSystem.desktopIcons().filter(i => i.title.startsWith('New Folder')).length;
    const newFolder: DesktopIcon = { 
      id: `folder-${Date.now()}`, 
      title: count === 0 ? 'New Folder' : `New Folder (${count + 1})`, 
      icon: 'assets/icons/folder.png', 
      type: 'folder',
      position: { x: 200, y: 200 } // Default position
    };
    this.fileSystem.addIcon(newFolder);
    this.contextMenuVisible.set(false);
  }

  renameIcon() {
    if (this.contextMenuTargetId) {
      const icon = this.fileSystem.desktopIcons().find(i => i.id === this.contextMenuTargetId);
      if (icon) {
        icon.isRenaming = true;
      }
    }
    this.contextMenuVisible.set(false);
  }

  onRenameSubmit(icon: DesktopIcon, newName: string) {
    this.fileSystem.renameIcon(icon.id, newName);
  }

  properties() {
    alert('Display Properties: Background settings would go here!');
    this.contextMenuVisible.set(false);
  }

  getIconById(id: string): DesktopIcon | undefined {
    return this.fileSystem.desktopIcons().find(i => i.id === id);
  }
}

