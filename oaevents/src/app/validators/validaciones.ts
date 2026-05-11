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

  public static tarjetaValida(control:AbstractControl): ValidationErrors | null {
    const numeroTarjeta = control.value.toString().replace(/[\s-]/g, '');
    let error = true;

    // Comprobamos que solo tenga números y una longitud válida (generalmente entre 13 y 19 dígitos)
    if (!/^\d{13,19}$/.test(numeroTarjeta)) {
      error = true;
    } else {
      let suma = 0;
      let alternar = false;

      // Aplicamos el Algoritmo de Luhn (de derecha a izquierda)
      for (let i = numeroTarjeta.length - 1; i >= 0; i--) {
        let n = parseInt(numeroTarjeta.charAt(i), 10);

        if (alternar) {
          n *= 2;
          if (n > 9) {
            n -= 9;
          }
        }

        suma += n;
        alternar = !alternar;
      }

      // Si la suma total acaba en 0 (módulo 10 === 0), la tarjeta es válida
      if (suma % 10 === 0) {
        error = false;
      }
    }
    return error ? { error: "Tarjeta incorrecta" } : null;
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
