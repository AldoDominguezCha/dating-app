import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.scss'],
})
export class TestErrorComponent implements OnInit {
  apiBaseUrl = 'https://localhost:5001/api';

  validationErrors: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  public getNotFoundError() {
    this.http.get(`${this.apiBaseUrl}/buggy/not-found-error`).subscribe({
      next: (response) => {},
      error: (error: HttpErrorResponse) => {
        console.log('------------- Not Found Error -------------');
        console.log(error);
      },
    });
  }

  public getBadRequestError() {
    this.http.get(`${this.apiBaseUrl}/buggy/bad-request`).subscribe({
      next: (response) => {},
      error: (error: HttpErrorResponse) => {
        console.log('------------- Bad Request Error -------------');
        console.log(error);
      },
    });
  }

  public getInternalServerError() {
    this.http.get(`${this.apiBaseUrl}/buggy/server-error`).subscribe({
      next: (response) => {},
      error: (error: HttpErrorResponse) => {
        console.log('------------- Internal Server Error -------------');
        console.log(error);
      },
    });
  }

  public getUnauthError() {
    this.http.get(`${this.apiBaseUrl}/buggy/auth-error`).subscribe({
      next: (response) => {},
      error: (error: HttpErrorResponse) => {
        console.log('------------- Unauthorized Error -------------');
        console.log(error);
      },
    });
  }

  public getValidationBadRequestError() {
    this.http.post(`${this.apiBaseUrl}/accounts/register`, {}).subscribe({
      next: (response) => {},
      error: (error: string[]) => {
        this.validationErrors = error;
        console.log('------------- Validation Bad Request Error -------------');
        console.log(error);
      },
    });
  }
}
