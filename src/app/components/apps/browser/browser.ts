import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-browser',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './browser.html',
  styleUrl: './browser.scss',
})
export class Browser {
  private sanitizer = inject(DomSanitizer);
  
  currentUrl = 'https://www.google.com/webhp?igu=1'; // igu=1 allows Google to be embedded in some cases
  safeUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentUrl);
  
  navigate(url: string) {
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    this.currentUrl = url;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  refresh() {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentUrl);
  }

  home() {
    this.navigate('https://www.google.com/webhp?igu=1');
  }
}
