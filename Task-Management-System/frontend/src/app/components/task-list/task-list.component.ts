import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { Task } from '../../task'; // Adjust path as per your project structure
import { TaskService } from './../../services/task.service'; // Adjust path as per your project structure
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatCardModule, MatIconModule, MatToolbarModule, CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnChanges, OnInit {
  @Input() tasks: Task[] = [];
  displayedColumns: string[] = ['title', 'description', 'dueDate', 'priority', 'status', 'action'];
  // @Output() getFormStatus = new EventEmitter<any>();
  // @Output() onDeleteTask = new EventEmitter<any>();

  userName: string = "";
  user: any = {};

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true,
  };

  subscription!: Subscription;
  userId: any;
  // dialog: any;

  constructor(private taskService: TaskService, private authService: AuthService, private router: Router, private dialog: MatDialog) { }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: response => {
        console.log(response);
        this.userId = response.data._id;
        this.loadTasks();
      },
      error: err => {
        console.error('Error fetching user:', err);
      }
    });
  }

  loadTasks(): void {
    console.log('userId----->', this.userId);
    if (this.userId) {
      this.taskService.getTasksbyUser(this.userId).subscribe({
        next: tasks => {
          this.tasks = tasks;
        },
        error: err => {
          console.error('Error fetching tasks:', err);
        }
      });
    }
  }

  editTask(task: any): void {
    this.router.navigate(['/addTask', { taskId: task._id }]);
  }
 

  deleteTask(task: any): void {
    const taskId = task._id;
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { message: 'Are you sure you want to delete this task?' }
    });
  
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.taskService.deleteTask(taskId).subscribe({
          next: response => {
            this.ngOnInit(); 
          },
          error: err => {
            console.error('Error Deleting Task:', err);
          }
        });
      }
    });
  }
}