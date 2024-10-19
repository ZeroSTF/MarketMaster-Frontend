import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
// interface SettingsForm {
//   emailOnFollow: boolean;
//   emailOnMention: boolean;
// }

// interface ProfileForm {
//   fullName: string;
//   email: string;
//   location: string;
//   organization: string;
// }

// interface SecurityForm {
//   username: string;
//   password: string;
//   organization: string;
//   date: string;
// }

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  activeTab: 'account' | 'security' = 'account';
  
 
  // Typed form groups
  profileForm: FormGroup<{
    fullName: FormControl<string>;
    email: FormControl<string>;
    location: FormControl<string>;
    organization: FormControl<string>;
  }>;

  emailOnFollowControl = new FormControl(true);
  emailOnAnswerControl = new FormControl(false);
  emailOnMentionControl = new FormControl(true);
  newLaunchesControl = new FormControl(false);
  monthlyUpdatesControl = new FormControl(false);
  newsletterControl = new FormControl(true);

  securityForm: FormGroup<{
    username: FormControl<string>;
    password: FormControl<string>;
    organization: FormControl<string>;
    date: FormControl<string>;
  }>;

  constructor(private fb: FormBuilder) {
    // Initialize profile form with strict typing
    this.profileForm = new FormGroup({
      fullName: new FormControl('Adela Parkson', { nonNullable: true }),
      email: new FormControl('adela@jegift.tn', { nonNullable: true }),
      location: new FormControl('st 5 building 2 3025', { nonNullable: true }),
      organization: new FormControl('Springvale Web LLC', { nonNullable: true })
    });

    // Initialize security form with strict typing
    this.securityForm = new FormGroup({
      username: new FormControl('Adela Parkson', { nonNullable: true }),
      password: new FormControl('************', { nonNullable: true }),
      organization: new FormControl('Springvale Web LLC', { nonNullable: true }),
      date: new FormControl('05 mars 1996', { nonNullable: true })
    });
  }

}
