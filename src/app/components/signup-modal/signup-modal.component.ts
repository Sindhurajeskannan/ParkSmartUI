import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.css']
})
export class SignupModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() switchToLogin = new EventEmitter<void>();

  userName = '';
  email = '';
  phoneNumber = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  errorMessage = '';
  successMessage = '';
  loading = false;

  // Touched flags for inline validation
  userNameTouched = false;
  emailTouched = false;
  phoneTouched = false;
  passwordTouched = false;
  confirmTouched = false;

  constructor(private authService: AuthService) {}

  isEmailValid(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

  isPhoneValid(): boolean {
    return /^[1-9][0-9]{9}$/.test(this.phoneNumber);
  }

  onSignup(): void {
    // Mark all as touched to show all errors
    this.userNameTouched = true;
    this.emailTouched = true;
    this.phoneTouched = true;
    this.passwordTouched = true;
    this.confirmTouched = true;

    if (!this.userName || !this.email || !this.phoneNumber || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    if (this.userName.length < 3) {
      this.errorMessage = 'Username must be at least 3 characters.';
      return;
    }
    if (!this.isEmailValid()) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }
    if (!this.isPhoneValid()) {
      this.errorMessage = 'Enter a valid 10-digit phone number (no leading zero).';
      return;
    }
    if (this.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.signup({
      userName: this.userName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Account created! Please login.';
        setTimeout(() => this.switchToLogin.emit(), 1500);
      },
      error: (err) => {
        this.loading = false;
        console.error('Signup error:', err);
        const backendMsg = err?.error?.message
          || err?.error?.error
          || err?.error?.errors?.[0]?.defaultMessage
          || (typeof err?.error === 'string' ? err.error : null)
          || `Error ${err.status}: Signup failed.`;
        this.errorMessage = backendMsg;
      }
    });
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
}
