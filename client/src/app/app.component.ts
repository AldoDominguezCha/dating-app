import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private httpClient: HttpClient = inject(HttpClient);

  public title = 'DatingApp';
  public users: any[] = null;

  public ngOnInit(): void {
    this.httpClient.get<any[]>('https://localhost:5001/api/users').subscribe({
      next: (users) => this.users = users
    })
  }
}
