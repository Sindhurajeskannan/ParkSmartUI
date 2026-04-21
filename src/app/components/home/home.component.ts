import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { SignupModalComponent } from '../signup-modal/signup-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, LoginModalComponent, SignupModalComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  showLogin = false;
  showSignup = false;
  arrivingTime = '';
  leavingTime = '';

  openLogin(): void {
    this.showLogin = true;
    this.showSignup = false;
  }

  openSignup(): void {
    this.showSignup = true;
    this.showLogin = false;
  }

  closeModals(): void {
    this.showLogin = false;
    this.showSignup = false;
  }
}
