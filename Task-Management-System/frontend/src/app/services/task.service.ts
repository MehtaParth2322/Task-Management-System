import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from "../task";

@Injectable({
  providedIn: 'root'
})

export class TaskService {

  constructor(private http: HttpClient) { }

  private apiUrl = "http://localhost:3000/api/tasks";
  private userapiUrl = "http://localhost:3000/api/tasks/user";

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
  };


  //Get Tasks
  getTasks(): Observable<any> {
    const url = `${this.apiUrl}`
    return this.http.get<any>(url);
  }

  getTaskById(taskId: string): Observable<any> {
    const url = `${this.apiUrl}/${taskId}`
    return this.http.get<any>(url, this.httpOptions);
  }

  //Get Tasks
  getTasksbyUser(userId: string): Observable<any> {
    const param = 'user/' + userId;
    const url = `${this.apiUrl}/${param}`
    return this.http.get<any>(url, this.httpOptions);
  }

  addTask(task: any): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.post<Task>(url + '/addTask', task);
  }

  updateTask(task: Task): Observable<any> {
    const url = `${this.apiUrl}/${task._id}`;
    return this.http.put<any>(url, task, this.httpOptions);
  }

  deleteTask(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url);
  }

}
