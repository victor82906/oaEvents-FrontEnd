import { Component } from '@angular/core';
import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-politica-privacidad',
  standalone: true,
  imports: [Cabecera, Footer],
  templateUrl: './politica-privacidad.html',
  styleUrl: './politica-privacidad.css'
})
export class PoliticaPrivacidad {
}
