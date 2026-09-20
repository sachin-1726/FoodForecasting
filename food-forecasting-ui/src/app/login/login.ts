import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) {}

  login() {

    if (this.username === 'admin' && this.password === 'admin123') {

      this.errorMessage = '';

      this.router.navigate(['/dashboard']);

    } else {

      this.errorMessage = 'Invalid username or password';

    }

  }

}