import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { User } from './login/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = false;
  token = null;
  private loginUrl = 'auth/login';

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(private http: HttpClient) { }

  login(user: User): Observable<any> {
    console.log('calling login...');
    return this.http.post('http://localhost:8000/' + this.loginUrl, user).pipe(
      tap(
        val => {
          if (val.token) {
            this.isLoggedIn = true;
            this.token = val.token;
          }
        }
      ));
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}
