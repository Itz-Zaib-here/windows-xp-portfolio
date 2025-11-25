import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume.html',
  styleUrl: './resume.scss',
})
export class Resume {
  private sanitizer = inject(DomSanitizer);
  
  // Google Drive Preview URL
  resumeUrl = 'https://drive.google.com/file/d/1PQ3YNVsRZCGobH6wwNgZUnr_tf-RfPdk/preview';
  safeUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.resumeUrl);
  
  // Direct View URL for downloading
  downloadUrl = 'https://drive.google.com/file/d/1PQ3YNVsRZCGobH6wwNgZUnr_tf-RfPdk/view?usp=sharing';

  download() {
    window.open(this.downloadUrl, '_blank');
  }
}
