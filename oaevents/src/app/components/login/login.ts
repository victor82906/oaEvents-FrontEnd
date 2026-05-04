import { CommonModule } from "@angular/common";
import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from "@angular/forms";
import {Router, RouterLink } from "@angular/router";
import {LoginService} from '../../services/login/login-service';
import {AuthService} from '../../services/auth/auth-service';
import {LoginRequest} from '../../model/usuario';
import { ModalError } from '../modal-error/modal-error';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, ModalError],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit{

  loginForm!: FormGroup;
  verContrasena: boolean = false;

  @ViewChild('modalError') modalError!: ModalError;

  constructor(private login: LoginService, private router: Router, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('' , [Validators.required, Validators.email]),
      contrasena: new FormControl('' , [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')])
    });
  }

  entrar() {
    if (this.loginForm.valid) {
      this.login.logout();
      const loginRequest: LoginRequest = this.loginForm.value;

      this.login.getTokenFromServer(loginRequest).subscribe({
        next: (respuesta) => {
          const token = respuesta.token;
          this.login.setToken(token);
          this.guardarUsuario();
        },
        error: (error) => {
          this.modalError.abrirModal("Error", error.error.message);
          this.cdr.markForCheck();
          console.error(error);
        }
      });
    }
  }

  guardarUsuario(){
    this.login.getUsuarioFromServer(this.auth.getToken() || '').subscribe({
      next: (respuesta) => {
        this.login.setUsuario(respuesta);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.modalError.abrirModal("Error", error.error.message);
        this.cdr.markForCheck();
        console.error(error);
      }
    });
  }

  toggleContrasena() {
    this.verContrasena = !this.verContrasena;
  }

}
