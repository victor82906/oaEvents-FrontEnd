import {Component, ViewChild, OnInit, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../services/auth/auth-service';
import {FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Validaciones} from '../../validators/validaciones';
import {UsuarioService} from '../../services/usuario/usuario-service';
import {CambiarContrasenaDto} from '../../model/usuario';
import {ModalError} from '../modal-error/modal-error';
import {ModalExito} from '../modal-exito/modal-exito';
import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cambiar-contrasena',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalError,
    ModalExito,
    Cabecera,
    Footer
  ],
  templateUrl: './cambiar-contrasena.html',
  styleUrl: './cambiar-contrasena.css',
})
export class CambiarContrasena implements OnInit {

  contrasenas!: FormGroup;
  verContrasena: boolean = false;
  id: number = 0;

  @ViewChild('modalError') modalError!: ModalError;
  @ViewChild('modalExito') modalExito!: ModalExito;


  constructor(private route: ActivatedRoute, private authService: AuthService, private usuarioService: UsuarioService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.id = this.authService.getId();

    this.contrasenas = new FormGroup({
      contrasenaActual: new FormControl('', [Validators.required]),
      contrasena: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')]),
      repetirContrasena: new FormControl('', [Validators.required])
    }, {
      validators: Validaciones.contrasenaIgual
    });
  }

  enviar() {
    if (this.contrasenas.valid) {
      const contrasenasDto: CambiarContrasenaDto = {
        contrasenaActual: this.contrasenas.value.contrasenaActual,
        contrasena: this.contrasenas.value.contrasena
      };

      this.usuarioService.cambiarContrasena(this.id, contrasenasDto).subscribe({
        next: (response) => {
          console.log(response);
          this.modalExito.abrirModal("Éxito", "La contraseña se ha cambiado correctamente");
          this.contrasenas.reset();
        },
        error: (error) => {
          this.modalError.abrirModal("Error", error.error.message);
          console.error(error);
          this.cdr.markForCheck();
        }
      });
    }else{
      this.contrasenas.markAllAsTouched();
    }
  }

  toggleContrasena() {
    this.verContrasena = !this.verContrasena;
  }

}
