import { Component, OnInit, inject } from '@angular/core';
import { SystemStateService } from '../../services/system-state';

@Component({
  selector: 'app-boot-screen',
  standalone: true,
  imports: [],
  templateUrl: './boot-screen.html',
  styleUrl: './boot-screen.scss',
})
export class BootScreen implements OnInit {
  private systemState = inject(SystemStateService);

  ngOnInit() {
    // Simulate boot time
    setTimeout(() => {
      this.systemState.bootState.set('login');
    }, 4000);
  }
}

