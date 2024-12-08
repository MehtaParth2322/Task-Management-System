import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  userName:string="";
  user:any={};

  subscription!: Subscription;

  constructor(private authService: AuthService, 
              private cookieService: CookieService, 
              private router: Router) { }

  ngOnInit(): void {
    console.log("Header's ngOnInIt");
    
    this.subscription = this.authService.user$.subscribe(data => {
      this.user = data;
      console.log("Header User: ",this.user);
    });

    this.authService.getUser().subscribe({
      next: res => {
        if (res.success) {
          const user = res.data;
          this.userName = user.first_name + " " + user.last_name;
        }
      },
      error: err => {
        if (!err.success) {
          this.cookieService.delete("accessToken");
          this.userName = "";
        }
      }
    });
  }
  
  logout() {
    this.authService.logout().subscribe({
      next: res => {
        this.userName = "";
        this.authService.setUser(null);
        this.router.navigate(["/login"]);
      },
      error: err => {
        if (!err.success) {
          this.router.navigate(["/login"]);
        }
      }
    });
  }

  openAddTaskForm(): void {
    this.router.navigate(['/addTask']); // Navigate to AddTaskComponent
  }

  isRegisterPage(): boolean {
    return this.router.url === '/register';
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}



