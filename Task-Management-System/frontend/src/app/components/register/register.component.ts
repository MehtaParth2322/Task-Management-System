import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from './../../user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl("", [Validators.required]),
      lastName: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required]),
      confirmPassword: new FormControl("", [Validators.required]),
    });
  }

  formSubmit() {
    const newUser: User = {
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };

    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password)
      return alert("All feilds are required");

    if (this.registerForm.controls['email'].status === "INVALID")
      return alert("Invalid email address");

    if (newUser.password !== this.registerForm.value.confirmPassword)
      return alert("Passwords doesn't matched");

    this.authService.register(newUser).subscribe({
      next: res => {
        if (res.data) {
          alert("User registered successfully");
          this.router.navigate(["/login"]);
        }
      },
      error: err => {
        alert(err.error.message);
      }
    });
  }
}
