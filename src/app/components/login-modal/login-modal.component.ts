import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() switchToSignup = new EventEmitter<void>();

  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  errorMessage = '';
  forgotSent = false;
  loading = false;

  // Track touched state for validation
  emailTouched = false;
  passwordTouched = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  onForgotPassword(): void {
    // Backend doesn't have this endpoint yet — show a friendly message
    this.forgotSent = true;
    setTimeout(() => this.forgotSent = false, 4000);
  }

  onLogin(): void {
    this.emailTouched = true;
    this.passwordTouched = true;

    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    if (!this.isEmailValid()) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }
    if (this.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.userService.getProfile().subscribe({
          next: (profile) => {
            this.authService.setUsername(profile.userName);
            this.loading = false;
            this.close.emit();
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.loading = false;
            this.close.emit();
            this.router.navigate(['/dashboard']);
          }
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Login error:', err);
        const backendMsg = err?.error?.message
          || err?.error?.error
          || (typeof err?.error === 'string' ? err.error : null)
          || 'Invalid email or password.';
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
