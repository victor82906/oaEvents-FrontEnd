import { Routes } from '@angular/router';
import {Login} from './components/login/login';
import { MapaRecinto } from './components/mapa-recinto/mapa-recinto';
import {Home} from './components/home/home';
import {RegistroComprador} from './components/registro-comprador/registro-comprador';
import {RegistroEmpresa} from './components/registro-empresa/registro-empresa';
import {CambiarContrasena} from './components/cambiar-contrasena/cambiar-contrasena';
import {EditarEmpresa} from './components/editar-empresa/editar-empresa';
import {EditarComprador} from './components/editar-comprador/editar-comprador';
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
import {EditarEvento} from './components/editar-evento/editar-evento';
import {TipoEvento} from './components/tipo-evento/tipo-evento';
import {CrearTipoEvento} from './components/crear-tipo-evento/crear-tipo-evento';
import {EventosComprador} from './components/eventos-comprador/eventos-comprador';
import {Evento} from './components/evento/evento';
import {GestionarEventos} from './components/gestionar-eventos/gestionar-eventos';
import {BuscarEvento} from './components/buscar-evento/buscar-evento';
import {EventosEmpresa} from './components/eventos-empresa/eventos-empresa';
import {PoliticaPrivacidad} from './components/politica-privacidad/politica-privacidad';
import {TerminosUso} from './components/terminos-uso/terminos-uso';
import {ComprarEntrada} from './components/comprar-entrada/comprar-entrada';
import {EventoComprador} from './components/evento-comprador/evento-comprador';
import {Eventos} from './components/eventos/eventos';
import {Chat} from './components/chat/chat';
import {BuscadorChat} from './components/buscador-chat/buscador-chat';

export const routes: Routes = [
  { path: "login", component: Login},
  { path: "home", component: Home},
  { path: "home-empresa", component: HomeEmpresa, canActivate: [rolGuard], data: { roles: ['EMPRESA'] }},
  { path: "home-recinto", component: HomeRecinto, canActivate: [rolGuard], data: { roles: ['RECINTO'] }},
  { path: "registro-comprador", component: RegistroComprador },
  { path: "registro-empresa", component: RegistroEmpresa },
  { path: "registro-validador", component: RegistroValidador, canActivate: [rolGuard], data: { roles: ['RECINTO'] }},
  { path: "crear-evento", component: CrearEvento, canActivate: [rolGuard], data: { roles: ['RECINTO', 'EMPRESA'] }},
  { path: "editar-evento", component: EditarEvento, canActivate: [rolGuard], data: { roles: ['RECINTO', 'EMPRESA'] }},
  { path: "editar-comprador", component: EditarComprador, canActivate: [rolGuard], data: { roles: ['COMPRADOR', 'RECINTO'] }},
  { path: "editar-empresa", component: EditarEmpresa, canActivate: [rolGuard], data: { roles: ['EMPRESA', 'RECINTO'] }},
  { path: "editar-recinto", component: EditarRecinto, canActivate: [rolGuard], data: { roles: ['RECINTO'] }},
  { path: "editar-validador", component: EditarValidador, canActivate: [rolGuard], data: { roles: ['RECINTO'] }},
  { path: "cambiar-contrasena", component: CambiarContrasena, canActivate: [rolGuard], data: { roles: ['COMPRADOR', 'EMPRESA', 'RECINTO'] }},
  { path: "evento-comprador", component: EventoComprador},
  { path: "mapa-recinto", component: MapaRecinto },
  { path: "buscar-comprador", component: BuscarComprador, canActivate: [rolGuard], data: { roles: ['RECINTO'] }},
  { path: "buscar-empresa", component: BuscarEmpresa, canActivate: [rolGuard], data: { roles: ['RECINTO'] }},
  { path: "buscar-validador", component: BuscarValidador, canActivate: [rolGuard], data: { roles: ['RECINTO'] }},
  { path: "tipo-evento", component: TipoEvento, canActivate: [rolGuard], data: { roles: ['RECINTO'] }},
  { path: "crear-tipo-evento", component: CrearTipoEvento, canActivate: [rolGuard], data: { roles: ['RECINTO'] }},
  { path: "eventos-comprador", component: EventosComprador, canActivate: [rolGuard], data: { roles: ['COMPRADOR'] }},
  { path: "eventos-empresa", component: EventosEmpresa, canActivate: [rolGuard], data: { roles: ['EMPRESA'] }},
  { path: "evento", component: Evento, canActivate: [rolGuard], data: { roles: ['RECINTO', 'EMPRESA'] }},
  { path: "gestionar-eventos", component: GestionarEventos, canActivate: [rolGuard], data: { roles: ['RECINTO'] }},
  { path: "buscar-evento", component: BuscarEvento, canActivate: [rolGuard], data: { roles: ['RECINTO'] }},
  { path: "politica-privacidad", component: PoliticaPrivacidad },
  { path: "terminos-uso", component: TerminosUso },
  { path: "comprar-entrada", component: ComprarEntrada },
  { path: "eventos", component: Eventos, canActivate: [rolGuard], data: { roles: ['RECINTO', 'EMPRESA'] }},
  { path: "chat", component: Chat, canActivate: [rolGuard], data: { roles: ['EMPRESA', 'RECINTO'] }},
  { path: "buscar-chat", component: BuscadorChat, canActivate: [rolGuard], data: { roles: ['RECINTO'] }},

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
