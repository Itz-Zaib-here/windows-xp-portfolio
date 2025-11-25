import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SystemStateService } from '../../services/system-state';

@Component({
  selector: 'app-shutdown-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shutdown-screen.html',
  styleUrl: './shutdown-screen.scss',
})
export class ShutdownScreen implements OnInit {
  private systemState = inject(SystemStateService);
  private sanitizer = inject(DomSanitizer);

  shutdownSoundUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/Gb2jGy76v0Y?autoplay=1&controls=0&showinfo=0');

  ngOnInit() {
    setTimeout(() => {
      this.systemState.bootState.set('blank');
    }, 4000);
  }
}
