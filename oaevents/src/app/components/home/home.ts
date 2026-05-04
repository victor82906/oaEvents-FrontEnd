import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth-service';
import {Meta, Title} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, Cabecera, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  constructor(private router: Router, private authService: AuthService, private cdr: ChangeDetectorRef, private titulo: Title, private meta: Meta) {}

  ngOnInit(): void {
    if(this.authService.getRol() == "RECINTO"){
      this.router.navigate(['/home-recinto']);
    }else if(this.authService.getRol() == "COMPRADOR"){
      this.router.navigate(['/home-comprador']);
    } else if(this.authService.getRol() == "EMPRESA"){
      this.router.navigate(['/home-empresa']);
    }
  }

}
