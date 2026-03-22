import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class LoginPage {

  user = '';
  pass = '';

  constructor(private router: Router) { }

  login() {
    if (this.user === 'admin' && this.pass === '1234') {
      alert('login correcto');

      this.router.navigate(['/tabs/tab1']);
    } else {
      alert('Datos incorrectos');
    }
  }
}