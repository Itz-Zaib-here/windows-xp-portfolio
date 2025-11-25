import { Component, inject } from '@angular/core';
import { SystemStateService } from '../../services/system-state';

@Component({
  selector: 'app-login-screen',
  standalone: true,
  imports: [],
  templateUrl: './login-screen.html',
  styleUrl: './login-screen.scss',
})
export class LoginScreen {
  private systemState = inject(SystemStateService);

  login() {
    // Play startup sound here if available
    // const audio = new Audio('assets/startup.mp3');
    // audio.play();
    
    this.systemState.bootState.set('desktop');
  }
}

