import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { LoginService } from './login.service'
import { User } from './user'

const LOGIN_FAILED_PAGE = '/login/failed';
const HOME_PAGE = '/home';
const UNAUTHORIZED_PAGE = '/login/unauthorized'

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  title = 'login';
  user: User;
  submitted = false;
  token: object;
  message = '';

  constructor(public authService: AuthService, public router: Router, private loginService: LoginService) {
    this.user = new User('', '');
  }

  onSubmit() {
    this.submitted = true;
    this.message = 'logging in....';
    this.authService.login(this.user).subscribe(() => {
      if (this.authService.isLoggedIn) {
        // Get the redirect URL from our auth service
        // If no redirect has been set, use the default
        let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : HOME_PAGE;

        // Redirect the user
        this.router.navigate([redirect]);
      }
    },
      (error) => {
        this.message = error.error.message;
      });
  }

}
