import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Validaciones} from '../../validators/validaciones';
import {CompradorInputDto} from '../../model/comprador';
import {CompradorService} from '../../services/comprador/comprador-service';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth/auth-service';
import {LoginService} from '../../services/login/login-service';
import {LoginRequest} from '../../model/usuario';
import { ModalError } from '../modal-error/modal-error';
import { ModalExito } from '../modal-exito/modal-exito';

@Component({
  selector: 'app-registro-comprador',
  standalone: true,
  imports: [ReactiveFormsModule, ModalError, ModalExito, RouterLink],
  templateUrl: './registro-comprador.html',
  styleUrl: './registro-comprador.css',
})
export class RegistroComprador {

  registroComprador!: FormGroup;
  verContrasena: boolean = false;

  @ViewChild('modalError') modalError!: ModalError;
  @ViewChild('modalExito') modalExito!: ModalExito;

  constructor(private compradorService: CompradorService, private router: Router, private authService: AuthService, private loginService: LoginService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.registroComprador = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', [Validators.required, Validators.minLength(8)]),
      repetirContrasena: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]),
      telefono: new FormControl('', [Validators.required, Validators.pattern('^[679][0-9]{8}$')]),
      dni: new FormControl('', [Validators.required, Validaciones.dniValido]),
      apellidos: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')])
    }, {
      validators: Validaciones.contrasenaIgual
    });
  }

  registrar() {
    if (this.registroComprador.valid){
      const comprador: CompradorInputDto = this.registroComprador.value;

      this.compradorService.save(comprador).subscribe({
        next: (compradorOutputDto) => {
          if (this.authService.getRol() !== 'RECINTO'){
            const loginForm: LoginRequest = {
              email: comprador.email,
              contrasena: comprador.contrasena
            }

            this.loginService.getTokenFromServer(loginForm).subscribe({
              next: (token) => {
                this.loginService.setToken(token.token);
                this.guardarUsuario();
              },
              error: (error) => {
                this.cdr.markForCheck();
                this.modalError.abrirModal("Error al Iniciar Sesión", error.error.message);
                console.error(error);
              }
            });
          } else {
            this.cdr.markForCheck();
            this.modalExito.abrirModal("Éxito", "El ciudadano se ha registrado correctamente");
          }
          this.registroComprador.reset();
        },
        error: (error) => {
          this.cdr.markForCheck();
          this.modalError.abrirModal("Error en el Registro", error.error.message);
          console.error(error);
        }
      });
    } else {
      this.registroComprador.markAllAsTouched();
    }
  }

  guardarUsuario() {
    this.loginService.getUsuarioFromServer(this.authService.getToken() || '').subscribe({
      next: (respuesta) => {
        this.loginService.setUsuario(respuesta);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.cdr.markForCheck();
        this.modalError.abrirModal("Error", error.error.message);
        console.error(error);
      }
    });
  }

  toggleContrasena() {
    this.verContrasena = !this.verContrasena;
  }

}
