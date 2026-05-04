import { AbstractControl, ValidationErrors } from "@angular/forms";

export class Validaciones {

  /*
      Funcion que valida el contenido de una caja de texto,
      lanza error cuando su contenido no es un DNI valido
  */
  public static dniValido(control: AbstractControl): ValidationErrors | null {
    let error = true;
    if(parseInt(control.value)){
      let numero = parseInt(control.value);
      let letra = control.value[control.value.length - 1].toUpperCase();
      if("TRWAGMYFPDXBNJZSQVHLCKE"[numero % 23] === letra){
        error = false;
      }
    }
    return error ? { error: "DNI incorrecto" } : null;
  }

  public static anterior(fecha:Date) {
    return function(control:AbstractControl): ValidationErrors | null {
      const inputDate = new Date(control.value);
      const error = inputDate > fecha;
      return error ? { error: "Fecha incorrecta" } : null;
    };
  }

  public static contrasenaIgual(control:AbstractControl): ValidationErrors | null {
    const contrasena = control.get('contrasena')?.value;
    const repetirContrasena = control.get('repetirContrasena')?.value;
    return contrasena === repetirContrasena ? null : { contrasena: "Las contraseñas no coinciden" };
  }

}
