import { Component } from '@angular/core';
import { Cabecera } from "../cabecera/cabecera";
import { Footer } from "../footer/footer";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home-recinto',
  standalone: true,
  imports: [
    Cabecera,
    Footer
  ],
  templateUrl: './home-recinto.html',
  styleUrl: './home-recinto.css',
})
export class HomeRecinto {

}
