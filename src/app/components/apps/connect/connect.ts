import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemStateService } from '../../../services/system-state';

@Component({
  selector: 'app-connect',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './connect.html',
  styleUrl: './connect.scss',
})
export class Connect {
  systemState = inject(SystemStateService);

  contacts = [
    { 
      name: 'WhatsApp', 
      status: 'Online', 
      link: 'https://wa.me/923707044870?text=Hi%20Shahzaib!%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect%20with%20you.', 
      id: 'whatsapp', 
      type: 'browser' 
    },
    { 
      name: 'Email', 
      status: 'Online', 
      link: 'https://mail.google.com/mail/?view=cm&fs=1&to=itz.zaib.here@gmail.com&su=Let%27s%20Connect%20-%20Portfolio%20Inquiry&body=Hi%20Shahzaib!%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect%20with%20you.', 
      id: 'email', 
      type: 'external' 
    },
    { 
      name: 'GitHub', 
      status: 'Busy', 
      link: 'https://github.com/Itz-Zaib-here', 
      id: 'github', 
      type: 'browser' 
    },
    { 
      name: 'LinkedIn', 
      status: 'Away', 
      link: 'https://www.linkedin.com/in/shah-zaib-akmal/', 
      id: 'linkedin', 
      type: 'browser' 
    }
  ];
  
  handleContactClick(event: Event, contact: any) {
    if (contact.type === 'browser') {
      event.preventDefault();
      this.systemState.openWindow(
        'browser', 
        contact.name, 
        'assets/icons/ie.png', 
        { url: contact.link },
        { width: 900, height: 500 }
      );
    }
    // For external links, let the default behavior happen
  }
}

