import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface WorkExperience {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
}

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    title: 'Junior Full Stack Developer',
    company: 'Software Technologies IT Solutions Prodivate Multan',
    period: 'Working',
    description: 'Developed web apps using Angular and .NET; performed code reviews, debugging, and testing. Worked with RESTful APIs, Git, and agile processes.',
    technologies: ['Angular', '.NET', 'C#', 'TypeScript', 'Git', 'REST APIs', 'SQL Server', 'HTML5', 'CSS3', 'Bootstrap','Reporting']
  },
  {
    title: 'Full Stack Developer Intern',
    company: 'Bin Yousaf Solution Provider, Lahore',
    period: '6 months',
    description: 'Built responsive Angular UIs and integrated .NET APIs. Implemented CRUD, form validation, authentication flows, dashboards, and supported testing and deployments.',
    technologies: ['Angular', 'TypeScript', 'RxJS', 'Bootstrap', 'ASP.NET Web API', 'C#', 'REST APIs', 'SQL Server', 'Chart.js', 'Git']
  }
];

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience {
  experiences = WORK_EXPERIENCE;
  selectedExperience = signal<WorkExperience | null>(null);

  select(exp: WorkExperience) {
    this.selectedExperience.set(exp);
  }
}
