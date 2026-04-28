import { CommonModule } from "@angular/common";
import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from "@angular/forms";
import {Router, RouterLink } from "@angular/router";
import {LoginService} from '../../services/login/login-service';
import {AuthService} from '../../services/auth/auth-service';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit{

  loginForm!: FormGroup;
  verContrasena: boolean = false;

  constructor(private login: LoginService, private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('' , [Validators.required, Validators.email]),
      contrasena: new FormControl('' , [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')])
    });
  }

  entrar() {
    if (this.loginForm.valid) {
      this.login.logout();
      this.login.getTokenFromServer(this.loginForm.value).subscribe({
        next: (respuesta) => {
          const token = respuesta.token;
          this.login.setToken(token);
          this.guardarUsuario();
        },
        error: (err) => {
          //lanzar error
          console.error(err);
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
      error: (err) => {
        //lanzar error
        console.error(err);
      }
    });
  }

  toggleContrasena() {
    this.verContrasena = !this.verContrasena;
  }

}
