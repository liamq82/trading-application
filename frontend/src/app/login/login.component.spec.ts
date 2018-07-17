import { TestBed, async } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule } from "@angular/forms";
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from './login.service'
import { of } from 'rxjs'
import { User } from "./user";
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

describe('LoginComponent', () => {
  let fixture
  let app
  let component: LoginComponent
  let loginSpy: jasmine.Spy;
  let fakeLoginService: jasmine.SpyObj<LoginService>
  let fakeAuthService: jasmine.SpyObj<AuthService>
  let loginFunctionSpy: jasmine.Spy
  let authFunctionSpy: jasmine.Spy
  let fakeRouter: Router
  let emailInput
  let passwordInput
  let loginButton

  beforeEach(async(() => {
    fakeLoginService = jasmine.createSpyObj('loginService', ['login']);
    loginFunctionSpy = fakeLoginService.login.and.returnValue(of({ token: '12345' }))

    fakeAuthService = jasmine.createSpyObj('authService', ['login']);
    authFunctionSpy = fakeAuthService.login.and.returnValue(of(true));

    fakeRouter = jasmine.createSpyObj('router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [
        LoginComponent
      ],
      imports: [FormsModule],
      providers: [
        { provide: LoginService, useValue: fakeLoginService },
        { provide: AuthService, useValue: fakeAuthService },
        { provide: Router, useValue: fakeRouter },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    app = fixture.componentInstance;
    emailInput = fixture.nativeElement.querySelector('#email')
    passwordInput = fixture.nativeElement.querySelector('#password')
    loginButton = fixture.nativeElement.querySelector('button')
    component = fixture.componentInstance;
  }));

  it('should navigate to home page on successful login', () => {
    fixture.componentInstance.onSubmit()

  });

  it('should call login function when onSubmit function called', function () {
    component.onSubmit();

    expect(component.submitted).toBeTruthy()
    expect(component.message).toEqual('logging in....');
    expect(authFunctionSpy).toHaveBeenCalled();
  })

  it('should log in when user clicks login button', () => {
    login('john@gmail.com', '12345');

    expect(authFunctionSpy).toHaveBeenCalledWith(new User('john@gmail.com', '12345'));
  })

  it('should create the app', async(() => {
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app'`, async(() => {
    expect(app.title).toEqual('login');
  }));

  it('should render title in a h1 tag', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('login');
  }));

  it('should disable login button if no email or password entered', function () {
    fixture.detectChanges()
    let loginButton = fixture.nativeElement.querySelector('button')

    expect(loginButton.disabled).toBeTruthy();
  });

  it('should enable login button when email and password entered', function () {
    enterEmailAndPassword('green', 'green');

    expect(loginButton.disabled).toBeFalsy()
  });

  it('should highlight email input with red if value not entered', function () {
    fixture.detectChanges();
    const emailInputClassList = fixture.nativeElement.querySelector('#email').classList;

    expect(emailInputClassList.contains('ng-invalid')).toBeTruthy();
  });

  it('should highlight password input with red if value not entered', function () {
    fixture.detectChanges();
    const passwordInputClassList = fixture.nativeElement.querySelector('#password').classList;

    expect(passwordInputClassList.contains('ng-invalid')).toBeTruthy();
  });

  it('should highlight password input with green if value  entered', function () {
    passwordInput.value = 'abc123';
    passwordInput.dispatchEvent(newEvent('input'));
    let passwordInputClassList = fixture.nativeElement.querySelector('#password').classList
    fixture.detectChanges()

    expect(passwordInputClassList.contains('ng-valid')).toBeTruthy()
    expect(passwordInputClassList.contains('ng-invalid')).toBeFalsy()
  })

  it('should highlight email input with green if value  entered', function () {
    emailInput.value = 'john@gmail.com';
    emailInput.dispatchEvent(newEvent('input'));
    let emailInputClassList = fixture.nativeElement.querySelector('#email').classList
    fixture.detectChanges()

    expect(emailInputClassList.contains('ng-valid')).toBeTruthy()
    expect(emailInputClassList.contains('ng-invalid')).toBeFalsy()
  });

  /**
   * Enter email and password into form and click login button.
   *
   * @param email
   * @param password
   */
  function login(email: string, password: string) {
    emailInput.value = email;
    emailInput.dispatchEvent(newEvent('input'));

    passwordInput.value = password;
    passwordInput.dispatchEvent(newEvent('input'));

    fixture.detectChanges();

    loginButton.click();
  }

  /**
   * Enter email and password into login form.
   *
   * @param email
   * @param password
   */
  function enterEmailAndPassword(email: string, password: string) {
    emailInput.value = email;
    emailInput.dispatchEvent(newEvent('input'));

    passwordInput.value = password;
    passwordInput.dispatchEvent(newEvent('input'));

    fixture.detectChanges();
  }

});


function newEvent(eventName: string, bubbles = false, cancelable = false) {
  let evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
  evt.initCustomEvent(eventName, bubbles, cancelable, null);
  return evt;
}