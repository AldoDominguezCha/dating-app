import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../../models/app-user.model';

@Injectable({
  providedIn: 'root',
})
export class UserAccountService {
  private apiBaseUrl = 'https://localhost:5001/api';
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

  public currentUser$(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  public setCurrentUser(user: User | null) {
    this.currentUser.next(user);
  }

  public registerNewUser(registerUserDTO: any): Observable<User> {
    return this.http
      .post<User>(`${this.apiBaseUrl}/accounts/register`, registerUserDTO)
      .pipe(tap((user: User) => this.storeUserInfo(user)));
  }

  public logIn(loginInfo: any): Observable<User> {
    return this.http.post<User>(`${this.apiBaseUrl}/accounts/login`, loginInfo).pipe(tap((user: User) => this.storeUserInfo(user)));
  }

  public logOut() {
    localStorage.removeItem('user');
    this.setCurrentUser(null);
  }

  private storeUserInfo(user: User) {
    if (!!user?.token) {
      localStorage.setItem('user', JSON.stringify(user));
      this.setCurrentUser(user);
    }
  }
}
