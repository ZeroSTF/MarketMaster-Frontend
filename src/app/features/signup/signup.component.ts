import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { SignupRequest } from '../../models/auth.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  showPassword = false;


  signupForm = this.fb.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordsMatchValidator }
  );

  onSubmit() {
    if (this.signupForm.valid) {
      const { confirmPassword, ...signupRequest } =
        this.signupForm.getRawValue();
      console.log('SIGNUP REQUEST IS: ', signupRequest);
      this.authService.signup(signupRequest as SignupRequest).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (error) => {
          console.error('Signup failed', error);
        },
      });
    }
  }

  // Custom validator to check if passwords match
  private passwordsMatchValidator(group: any) {
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }
}
