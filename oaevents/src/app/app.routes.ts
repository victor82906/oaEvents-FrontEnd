import { Routes } from '@angular/router';
import {Login} from './components/login/login';
import { MapaRecinto } from './components/mapa-recinto/mapa-recinto';
import {Home} from './components/home/home';
import {RegistroComprador} from './components/registro-comprador/registro-comprador';
import {RegistroEmpresa} from './components/registro-empresa/registro-empresa';
import {CambiarContrasena} from './components/cambiar-contrasena/cambiar-contrasena';
import {EditarEmpresa} from './components/editar-empresa/editar-empresa';
import {EditarComprador} from './components/editar-comprador/editar-comprador';
import {HomeComprador} from './components/home-comprador/home-comprador';
import {HomeEmpresa} from './components/home-empresa/home-empresa';
import {HomeRecinto} from './components/home-recinto/home-recinto';
import {rolGuard} from './guards/rol-guard';
import {BuscarComprador} from './components/buscar-comprador/buscar-comprador';
import {EditarRecinto} from './components/editar-recinto/editar-recinto';
import {BuscarEmpresa} from './components/buscar-empresa/buscar-empresa';
import {RegistroValidador} from './components/registro-validador/registro-validador';
import {EditarValidador} from './components/editar-validador/editar-validador';
import {BuscarValidador} from './components/buscar-validador/buscar-validador';
import {CrearEvento} from './components/crear-evento/crear-evento';

export const routes: Routes = [
  { path: "login", component: Login},
  { path: "home", component: Home},
  { path: "home-comprador", component: HomeComprador, canActivate: [rolGuard], data: { roles: ['COMPRADOR'] }},
  { path: "home-empresa", component: HomeEmpresa, canActivate: [rolGuard], data: { roles: ['EMPRESA'] }},
  { path: "home-recinto", component: HomeRecinto, canActivate: [rolGuard], data: { roles: ['RECINTO'] }},
  { path: "registro-comprador", component: RegistroComprador},
  { path: "registro-empresa", component: RegistroEmpresa},
  { path: "registro-validador", component: RegistroValidador, canActivate: [rolGuard], data: { roles: ['RECINTO'] }},
  { path: "crear-evento", component: CrearEvento, canActivate: [rolGuard], data: { roles: ['RECINTO', 'EMPRESA'] }},
  { path: "editar-comprador", component: EditarComprador, canActivate: [rolGuard], data: { roles: ['COMPRADOR', 'RECINTO'] }},
  { path: "editar-empresa", component: EditarEmpresa, canActivate: [rolGuard], data: { roles: ['EMPRESA', 'RECINTO'] }},
  { path: "editar-recinto", component: EditarRecinto, canActivate: [rolGuard], data: { roles: ['RECINTO'] }},
  { path: "editar-validador", component: EditarValidador, canActivate: [rolGuard], data: { roles: ['RECINTO'] }},
  { path: "cambiar-contrasena", component: CambiarContrasena, canActivate: [rolGuard], data: { roles: ['COMPRADOR', 'EMPRESA', 'RECINTO'] }},
  { path: "mapa-recinto", component: MapaRecinto},
  { path: "buscar-comprador", component: BuscarComprador, canActivate: [rolGuard], data: { roles: ['RECINTO'] }},
  { path: "buscar-empresa", component: BuscarEmpresa, canActivate: [rolGuard], data: { roles: ['RECINTO'] }},
  { path: "buscar-validador", component: BuscarValidador, canActivate: [rolGuard], data: { roles: ['RECINTO'] }},

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
