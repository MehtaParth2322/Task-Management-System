import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Task } from '../../task';
import { TaskService } from './../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [    
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})

export class AddTaskComponent implements OnInit {
  @Output() taskAdded = new EventEmitter<Task>();
  @Input() formOptions: any = {};
  @Output() getFormStatus = new EventEmitter<any>();

  userId: any;
  task: Task = {
    title: '',
    description: '',
    priority: 'low',
    status: 'pending',
    dueDate: new Date(),
    _id: undefined,
    userId: undefined
  };
  taskId: any;

  constructor(private taskService: TaskService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe(response => {
      this.userId = response.data._id;
    });

    console.log('this.router', this.router.url)
    const task = this.router.url.split('=')
    this.taskId = task[1];
    
    if (this.taskId) {
      this.taskService.getTaskById(this.taskId).subscribe(
        (task: any) => {

          this.task = JSON.parse(JSON.stringify(task))[0];
          const date = new Date(this.task.dueDate);
          const Endmonth = date.getMonth() < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1;
          const Enddate = date.getDate() < 10 ? ('0' + (date.getDate())) : date.getDate();
          const formatted_date = date.getFullYear() + "-" + (Endmonth) + "-" + (Enddate)
          this.task.dueDate = this.task.dueDate = formatted_date;
          console.log('this.task', this.task);
          
        },
        (error) => {
          console.error('Error fetching task:', error);
        }
      );
    }
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.taskId) {
        const updateTask: Task ={
          ...this.task
        }
        this.taskService.updateTask(updateTask).subscribe(
          (updatedTask: Task) => {
            console.log('Task updated successfully:', updatedTask);
            this.taskAdded.emit(updatedTask);
            alert('Task updated successfully'); 
            form.resetForm();
            this.router.navigate(["/taskList"]);
          },
          (error) => {
            console.error('Error updating task:', error);
          }
        );
      } else {
        const newTask: Task = {
          ...this.task,
          userId: this.userId,
        };

        this.taskService.addTask(newTask).subscribe(
          (addedTask: Task) => {
            console.log('Task added successfully:', addedTask);
            this.taskAdded.emit(addedTask);
            alert('Task added successfully');
            form.resetForm();
          },
          (error) => {
            console.error('Error adding task:', error);
          }
        );
      }
    }
  }

  closeForm(): void {
    this.getFormStatus.emit({
      formType: '',
      formTitle: '',
      showForm: '',
      editTaskId: undefined
    });
  }
}


