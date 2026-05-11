import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-terminos-uso',
  standalone: true,
  imports: [CommonModule, Cabecera, Footer],
  templateUrl: './terminos-uso.html',
  styleUrl: './terminos-uso.css',
})
export class TerminosUso {

}
