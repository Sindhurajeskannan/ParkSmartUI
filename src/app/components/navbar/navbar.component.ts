import { Component, OnInit, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() openLogin = new EventEmitter<void>();

  isLoggedIn = false;
  dropdownOpen = false;
  mobileMenuOpen = false;
  username = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      this.username = this.authService.getUsername() || '';
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  onNavLinkClick(): void {
    this.mobileMenuOpen = false;
    if (!this.isLoggedIn) {
      this.openLogin.emit();
    }
  }

  goToProfile(): void {
    this.dropdownOpen = false;
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.dropdownOpen = false;
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.router.navigate(['/'])
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
      this.mobileMenuOpen = false;
    }
  }
}
