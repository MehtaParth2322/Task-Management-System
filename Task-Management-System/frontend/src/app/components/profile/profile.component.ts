import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: any = {};
  userName: string | undefined;

  constructor(private authService: AuthService, private router: Router, private userService: UserService,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe(
      response => {
        this.user = response.data;
        console.log('this.user', this.user);
        
      },
      error => {
        console.error('Error fetching user details:', error);
      }
    );
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

  deleteUser(id: any): void{

    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { message: 'Are you sure you want to delete this task?' }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.userService.deleteUser(id).subscribe({
          next: res => {
            this.router.navigate(["/login"]);
          },
          error: err => {
            if (!err.success) {
              this.router.navigate(["/home"]);
            }
          }
        })
      }
    });
  }
}
