import { Injectable } from '@angular/core';
import {
    Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CusipService } from './home/cusip.service';
import { Cusip } from './home/cusip';

@Injectable()
export class CusipResolver implements Resolve<Cusip[]> {
    constructor(private cusipService: CusipService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cusip[]> {
        return this.cusipService.getCusips().pipe(
            map(cusips => {
                if (cusips) {
                    return cusips;
                }
            })
        );
    }
}