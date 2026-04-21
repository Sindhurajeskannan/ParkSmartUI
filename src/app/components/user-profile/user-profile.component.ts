import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserService, UserProfile } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, DecimalPipe, NavbarComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  loading = true;
  errorMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.userService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to load profile. Please try again.';
        this.loading = false;
      }
    });
  }

  getInitials(): string {
    if (!this.profile?.userName) return '?';
    return this.profile.userName
      .split(' ')
      .map((w: string) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
