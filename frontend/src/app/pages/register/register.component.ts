import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const trimmedData = {
        username: formValue.username.trim(),
        password: formValue.password
      };
      this.authService.register(trimmedData).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.toastr.success('Successfully registered');
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'Registration failed';
          this.toastr.error(errorMessage);
        }
      });
    }
  }
}
