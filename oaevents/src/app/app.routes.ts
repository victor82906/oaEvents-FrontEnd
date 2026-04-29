import { Routes } from '@angular/router';
import {Login} from './components/login/login';
import { MapaRecinto } from './components/mapa-recinto/mapa-recinto';

export const routes: Routes = [
  { path: "login", component: Login},
  { path: "mapa-recinto", component: MapaRecinto},

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
