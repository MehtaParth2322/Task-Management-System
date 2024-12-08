import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-confirm-register',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule],
  templateUrl: './confirm-register.component.html',
  styleUrl: './confirm-register.component.css'
})
export class ConfirmRegisterComponent {
  confirmRegisterForm!: FormGroup;

  email:string = "abc123@gmail.com";

  ngOnInit(): void {
    this.confirmRegisterForm = new FormGroup({
      code: new FormControl("", [Validators.required])
    });
  }

  formSubmit() {
    const user = {
      email: this.email,
      code: this.confirmRegisterForm.value.code,
    };

    if (!user.code)
      return alert("Confirmation code is required");
  
    console.log(user);
  }
}
