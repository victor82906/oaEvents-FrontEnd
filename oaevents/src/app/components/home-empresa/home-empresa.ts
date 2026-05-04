import { Component } from '@angular/core';
import {Cabecera} from "../cabecera/cabecera";
import {Footer} from "../footer/footer";

@Component({
  selector: 'app-home-empresa',
    imports: [
        Cabecera,
        Footer
    ],
  templateUrl: './home-empresa.html',
  styleUrl: './home-empresa.css',
})
export class HomeEmpresa {

}
