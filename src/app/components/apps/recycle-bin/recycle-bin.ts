import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSystemService } from '../../../services/file-system';

@Component({
  selector: 'app-recycle-bin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recycle-bin.html',
  styleUrl: './recycle-bin.scss',
})
export class RecycleBin {
  fileSystem = inject(FileSystemService);

  restore(id: string) {
    this.fileSystem.restoreFromRecycleBin(id);
  }

  delete(id: string) {
    this.fileSystem.deletePermanently(id);
  }

  empty() {
    this.fileSystem.emptyRecycleBin();
  }
}
