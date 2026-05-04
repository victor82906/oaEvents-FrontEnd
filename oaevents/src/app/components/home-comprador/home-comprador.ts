import { Component } from '@angular/core';
import {Cabecera} from "../cabecera/cabecera";
import {Footer} from "../footer/footer";

@Component({
  selector: 'app-home-comprador',
    imports: [
        Cabecera,
        Footer
    ],
  templateUrl: './home-comprador.html',
  styleUrl: './home-comprador.css',
})
export class HomeComprador {

}
