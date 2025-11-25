import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Repo {
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  private http = inject(HttpClient);
  
  repos = signal<Repo[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.fetchRepos();
  }

  fetchRepos() {
    this.loading.set(true);
    this.error.set('');
    
    this.http.get<Repo[]>('https://api.github.com/users/Itz-Zaib-here/repos')
      .subscribe({
        next: (data) => {
          this.repos.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to fetch repos', err);
          this.error.set('Failed to load projects from GitHub.');
          this.loading.set(false);
        }
      });
  }

  openRepo(url: string) {
    window.open(url, '_blank');
  }
}
