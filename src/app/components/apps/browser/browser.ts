import { Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-browser',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './browser.html',
  styleUrl: './browser.scss',
})
export class Browser {
  private sanitizer = inject(DomSanitizer);
  private http = inject(HttpClient);
  
  @Input() url?: string;

  currentUrl = 'https://www.google.com/webhp?igu=1';
  safeUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentUrl);
  
  viewMode = signal<'iframe' | 'github' | 'linkedin' | 'whatsapp' | 'email'>('iframe');
  
  // GitHub Data
  githubProfile = signal<any>(null);
  githubRepos = signal<any[]>([]);
  
  // Email Data
  emailSubject = signal('Hello from Portfolio');
  emailBody = signal('');

  ngOnInit() {
    if (this.url) {
      this.navigate(this.url);
    }
  }

  navigate(url: string) {
    if (!url.startsWith('http') && !url.startsWith('mailto:')) {
      url = 'https://' + url;
    }
    this.currentUrl = url;
    
    // Check for special domains
    if (url.includes('github.com')) {
      this.viewMode.set('github');
      this.loadGithubData();
    } else if (url.includes('linkedin.com')) {
      this.viewMode.set('linkedin');
    } else if (url.includes('wa.me') || url.includes('whatsapp.com')) {
      this.viewMode.set('whatsapp');
    } else if (url.includes('mailto:')) {
      this.viewMode.set('email');
    } else {
      this.viewMode.set('iframe');
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

  loadGithubData() {
    // Fetch profile
    this.http.get('https://api.github.com/users/Itz-Zaib-here').subscribe({
      next: (data) => this.githubProfile.set(data),
      error: (err) => console.error('GitHub API Error:', err)
    });

    // Fetch repos
    this.http.get('https://api.github.com/users/Itz-Zaib-here/repos').subscribe({
      next: (data: any) => {
        // Sort by stars or updated
        const sorted = data.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        this.githubRepos.set(sorted);
      },
      error: (err) => console.error('GitHub API Error:', err)
    });
  }

  openExternal() {
    window.open(this.currentUrl, '_blank');
  }

  sendEmail() {
    const subject = encodeURIComponent(this.emailSubject());
    const body = encodeURIComponent(this.emailBody());
    const mailtoLink = `mailto:itz.zaib.here@gmail.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_self');
  }

  refresh() {
    if (this.viewMode() === 'iframe') {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentUrl);
    } else if (this.viewMode() === 'github') {
      this.loadGithubData();
    }
  }

  home() {
    this.navigate('https://www.google.com/webhp?igu=1');
  }
}
