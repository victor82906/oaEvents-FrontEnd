import { Component } from '@angular/core';
import { Cabecera } from "../cabecera/cabecera";
import { Footer } from "../footer/footer";
import { PanelAdministracion } from '../panel-administracion/panel-administracion';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home-recinto',
  standalone: true,
  imports: [
    Cabecera,
    Footer,
    PanelAdministracion,
    RouterOutlet
  ],
  templateUrl: './home-recinto.html',
  styleUrl: './home-recinto.css',
})
export class HomeRecinto {

}
