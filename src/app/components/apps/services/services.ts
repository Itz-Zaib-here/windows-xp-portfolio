import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Service {
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export const SERVICES: Service[] = [
  {
    title: 'Frontend Development',
    description: 'Building responsive, modern web applications with Angular and TypeScript',
    icon: 'fas fa-code',
    features: ['Angular Development', 'TypeScript', 'Responsive Design', 'UI/UX Implementation']
  },
  {
    title: 'Backend Development',
    description: 'Creating robust APIs and server-side applications with .NET',
    icon: 'fas fa-server',
    features: ['.NET Web APIs', 'C# Development', 'Database Design', 'RESTful Services']
  },
  {
    title: 'Full Stack Solutions',
    description: 'End-to-end web application development from concept to deployment',
    icon: 'fas fa-laptop-code',
    features: ['Complete Web Apps', 'Database Integration', 'API Development', 'Deployment & Maintenance']
  }
];

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  services = SERVICES;
  selectedService = signal<Service | null>(null);

  select(service: Service) {
    this.selectedService.set(service);
  }
}
