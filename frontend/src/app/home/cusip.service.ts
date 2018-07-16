import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Cusip } from './cusip';
import { AuthService } from '../auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class CusipService {
  cusips: Cusip[] = [
    new Cusip('one'),
    new Cusip('two'),
    new Cusip('three'),
  ];

  private cusipsUrl = 'api/Cusips';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getCusips(): Observable<Cusip[]> {
    return this.http.get<Cusip[]>('http://localhost:8000/' + this.cusipsUrl,
      {
        headers: { 'token': this.authService.token }
      });
  }
}
