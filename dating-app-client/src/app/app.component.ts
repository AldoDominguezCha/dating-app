import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Test';
  users: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('https://localhost:5001/api/users').subscribe({
      next: (users: any) => (this.users = users),
      error: (error: HttpErrorResponse) => {
        console.log(typeof error);
        console.log(error);
      },
      complete: () => {
        console.log('HTTP GET Observable completed!');
      },
    });
  }
}
