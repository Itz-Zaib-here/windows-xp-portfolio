import { Component, OnInit, inject } from '@angular/core';
import { SystemStateService } from '../../services/system-state';

@Component({
  selector: 'app-blank-screen',
  standalone: true,
  template: '<div style="background: black; width: 100vw; height: 100vh;"></div>',
})
export class BlankScreen implements OnInit {
  private systemState = inject(SystemStateService);

  ngOnInit() {
    setTimeout(() => {
      this.systemState.bootState.set('booting');
    }, 2000);
  }
}
