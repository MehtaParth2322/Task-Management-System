import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from "./../user";
import { Observable, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private user = new Subject<any>();
  user$ = this.user.asObservable();

  constructor(private http: HttpClient,
    private cookieService: CookieService) { }

  private apiUrl = "http://localhost:3000/api/auth";

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    withCredentials: true,
  };

  setUser(user: any) {
    this.user.next(user);
  }

  // Get a User Details
  getUser(): Observable<any> {
    const url = `${this.apiUrl}/user`;
    return this.http.get<any>(url, this.httpOptions);
  }

  login(user: any): Observable<any> {
    const url = `${this.apiUrl}/login`;
    return this.http.post<User>(url, user, this.httpOptions);
  }

  register(user: User): Observable<any> {
    const url = `${this.apiUrl}/register`;
    return this.http.post<any>(url, user, this.httpOptions);
  }

  logout(): Observable<any> {
    const url = `${this.apiUrl}/logout`;
    return this.http.delete<any>(url, this.httpOptions);
  }

  getNewAccessToken(): Observable<any> {
    const url = `${this.apiUrl}/refreshAccessToken`;
    return this.http.post<any>(url, this.httpOptions);
  }

  isAuthenticated(): any {
    const token = this.cookieService.get("accessToken");
    return token ? true : false;
  }
}
