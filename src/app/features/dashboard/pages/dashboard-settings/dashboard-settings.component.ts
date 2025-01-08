import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../auth/auth.service';
import { UpdateUserDTO, User } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';

interface ProfileForm {
  firstname: FormControl<string>;
  lastname: FormControl<string>;
  username: FormControl<string>;
}

interface SecurityForm {
  currentPassword: FormControl<string>;
  newPassword: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-dashboard-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './dashboard-settings.component.html',
  styleUrl: './dashboard-settings.component.css',
})
export class DashboardSettingsComponent {
  activeTab: 'account' | 'security' = 'account';
  private authService = inject(AuthService);
  private userService = inject(UserService);

  profileForm: FormGroup<ProfileForm>;
  securityForm: FormGroup<SecurityForm>;

  currentUser = computed(() => this.authService.currentUser());
  updateStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  errorMessage = signal<string>('');

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group<ProfileForm>({
      firstname: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      lastname: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
    });

    this.securityForm = this.fb.group<SecurityForm>(
      {
        currentPassword: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        newPassword: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(8)],
        }),
        confirmPassword: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      },
      {
        //validators: this.passwordMatchValidator,
      }
    );

    // Effect to update form when user changes
    effect(() => {
      const user = this.currentUser();
      if (user) {
        console.log('here');
        console.log(user);
        this.profileForm.patchValue(
          {
            firstname: user.firstName,
            lastname: user.lastName,
            username: user.username,
          },
          { emitEvent: false }
        );
      }
    });
  }

  private passwordMatchValidator(
    group: FormGroup
  ): null | { passwordMismatch: true } {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  async updateProfile(): Promise<void> {
    if (this.profileForm.invalid) return;

    try {
      this.updateStatus.set('loading');
      const updatedUser: UpdateUserDTO = {
        firstName: this.profileForm.value.firstname!,
        lastName: this.profileForm.value.lastname!,
        username: this.profileForm.value.username!,
      };

      await this.userService.updateUser(updatedUser);
      this.updateStatus.set('success');
    } catch (error) {
      this.updateStatus.set('error');
      this.errorMessage.set('Failed to update profile');
    }
  }

  async updatePassword(): Promise<void> {
    if (this.securityForm.invalid) return;

    try {
      this.updateStatus.set('loading');
      await this.userService.updatePassword(
        this.securityForm.value.currentPassword!,
        this.securityForm.value.newPassword!
      );
      this.securityForm.reset();
      this.updateStatus.set('success');
      setTimeout(() => {
        this.authService.logout();
      }, 2000);
    } catch (error) {
      this.updateStatus.set('error');
      this.errorMessage.set('Failed to update password');
    }
  }
}
