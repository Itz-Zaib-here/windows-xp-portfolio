import { Routes } from '@angular/router';
import { Desktop } from './components/desktop/desktop';

export const routes: Routes = [
  { path: '', component: Desktop },
  { path: '**', redirectTo: '' }
];
