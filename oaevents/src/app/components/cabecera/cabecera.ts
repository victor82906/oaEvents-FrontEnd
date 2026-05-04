import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';
import { LoginService } from '../../services/login/login-service';

@Component({
  selector: 'app-cabecera',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cabecera.html',
  styleUrl: './cabecera.css',
})
export class Cabecera implements OnInit {
  menuAbierto: boolean = false;
  menuUsuarioAbierto: boolean = false;
  rolUsuario: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    if (this.isAuth()) {
      this.rolUsuario = this.authService.getRol();
    }
  }

  isAuth() {
    return this.authService.isAuth();
  }

  logout(): void {
    this.loginService.logout();
    this.rolUsuario = ''; // Limpiamos el rol al cerrar sesión
    this.menuUsuarioAbierto = false;
    this.router.navigate(['/home']);
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  toggleMenuUsuario(): void {
    this.menuUsuarioAbierto = !this.menuUsuarioAbierto;
  }

  navegar(ruta: string): void {
    this.router.navigate([ruta]);
    this.menuUsuarioAbierto = false;
  }

  crearEvento(){
    this.router.navigate(['/crear-evento'], {queryParams: {empresaId: this.authService.getId()}});
  }

  editar(){
    if(this.rolUsuario === "COMPRADOR"){
      this.router.navigate(['/editar-comprador'], {queryParams: {id: this.authService.getId()}})
    } else if(this.rolUsuario === "EMPRESA"){
      this.router.navigate(['/editar-empresa'], {queryParams: {id: this.authService.getId()}})
    } else if(this.rolUsuario === "RECINTO"){
      this.router.navigate(['/editar-recinto'], {queryParams: {id: this.authService.getId()}});
    }
    this.menuUsuarioAbierto = false;
  }

}
