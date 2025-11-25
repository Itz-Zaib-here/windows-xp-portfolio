import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connect',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './connect.html',
  styleUrl: './connect.scss',
})
export class Connect {
  contacts = [
    { name: 'Email', status: 'Online', link: 'mailto:example@email.com' },
    { name: 'WhatsApp', status: 'Away', link: 'https://whatsapp.com' },
    { name: 'LinkedIn', status: 'Busy', link: 'https://linkedin.com' }
  ];
  
  openLink(link: string) {
    window.open(link, '_blank');
  }
}

