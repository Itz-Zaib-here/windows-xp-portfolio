import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SystemStateService } from '../../services/system-state';
import { FileSystemService } from '../../services/file-system';

@Component({
  selector: 'app-start-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-menu.html',
  styleUrl: './start-menu.scss',
})
export class StartMenu {
  systemState = inject(SystemStateService);
  fileSystem = inject(FileSystemService);
  
  showAllPrograms = signal(false);

  openApp(id: string, title: string, icon: string) {
    this.systemState.openWindow(id, title, icon);
    this.systemState.closeStartMenu();
  }

  openLink(url: string) {
    window.open(url, '_blank');
    this.systemState.closeStartMenu();
  }
  
  logOff() {
    this.systemState.bootState.set('shutdown');
    this.systemState.closeStartMenu();
  }

  toggleAllPrograms() {
    this.showAllPrograms.update(v => !v);
  }
}

