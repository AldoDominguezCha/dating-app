import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public registerMode: boolean = false;
  public users: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsers();
  }

  public setRegisterMode(registerMode: boolean) {
    this.registerMode = registerMode;
  }

  private getUsers() {
    this.http.get('https://localhost:5001/api/users').subscribe({
      next: (users: any) => (this.users = users),
    });
  }
}
