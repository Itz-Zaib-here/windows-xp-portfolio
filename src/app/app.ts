import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BootScreen } from './components/boot-screen/boot-screen';
import { LoginScreen } from './components/login-screen/login-screen';
import { Desktop } from './components/desktop/desktop';
import { ShutdownScreen } from './components/shutdown-screen/shutdown-screen';
import { BlankScreen } from './components/blank-screen/blank-screen';
import { SystemStateService } from './services/system-state';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BootScreen, LoginScreen, Desktop, ShutdownScreen, BlankScreen],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  systemState = inject(SystemStateService);
}

