import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from "./user";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginUrl = 'auth/login'

  constructor(private http: HttpClient) { }

  login(user: User) {
    return this.http.post('http://localhost:8000/' + this.loginUrl, user)
  }

}
