import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private authService: AuthService) { }
    

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    });
  }

  formSubmit() {
    const user = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    if (!user.email || !user.password)
      return alert("Email and Password are required");

    if (this.loginForm.controls['email'].status === "INVALID")
      return alert("Invalid email address");

    this.authService.login(user).subscribe({
      next: res => {
        if (res.success) {
          this.authService.setUser(res.data);
          location.href = "/home";     // for whole page reload
        }
      },
      error: err => {
        if (!err.error.success) {
          alert("Invalid Email or Password");
        }
      }
    });
  }
}
