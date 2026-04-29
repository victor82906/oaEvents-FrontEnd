import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth-service';
import {Meta, Title} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  constructor(private router: Router, private auth: AuthService, private cdr: ChangeDetectorRef, private titulo: Title, private meta: Meta) {}

  ngOnInit(): void {
    if(this.auth.getRol().nombre == "RECINTO"){
      this.router.navigate(['/recinto']);
    }else if(this.auth.getRol().nombre == "COMPRADOR"){
      this.router.navigate(['/comprador']);
    } else if(this.auth.getRol().nombre == "EMPRESA"){
      this.router.navigate(['/empresa']);
    }
  }

}
