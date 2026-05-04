import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Validaciones } from '../../validators/validaciones';
import { EmpresaInputDto } from '../../model/empresa';
import { EmpresaService } from '../../services/empresa/empresa-service';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';
import { LoginService } from '../../services/login/login-service';
import { LoginRequest } from '../../model/usuario';
import { ModalError } from '../modal-error/modal-error';
import { ModalExito } from '../modal-exito/modal-exito';

@Component({
  selector: 'app-registro-empresa',
  standalone: true,
  imports: [ReactiveFormsModule, ModalError, ModalExito, RouterLink],
  templateUrl: './registro-empresa.html',
  styleUrl: './registro-empresa.css',
})
export class RegistroEmpresa implements OnInit {

  registroEmpresa!: FormGroup;
  verContrasena: boolean = false;

  @ViewChild('modalError') modalError!: ModalError;
  @ViewChild('modalExito') modalExito!: ModalExito;

  constructor(
    private empresaService: EmpresaService,
    private router: Router,
    private authService: AuthService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.registroEmpresa = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')]),
      repetirContrasena: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required, Validators.pattern('^[679][0-9]{8}$')]),
      cif: new FormControl('', [Validators.required])
    }, {
      validators: Validaciones.contrasenaIgual
    });
  }

  registrar() {
    if (this.registroEmpresa.valid) {
      const empresa: EmpresaInputDto = this.registroEmpresa.value;

      this.empresaService.save(empresa).subscribe({
        next: (empresaOutputDto) => {
          if (this.authService.getRol() !== 'RECINTO') {
            const loginForm: LoginRequest = {
              email: empresa.email,
              contrasena: empresa.contrasena
            };

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
            this.modalExito.abrirModal("Éxito", "La empresa se ha registrado correctamente");
          }
          this.registroEmpresa.reset();
        },
        error: (error) => {
          this.cdr.markForCheck();
          this.modalError.abrirModal("Error en el Registro", error.error.message);
          console.error(error);
        }
      });
    } else {
      this.registroEmpresa.markAllAsTouched();
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
