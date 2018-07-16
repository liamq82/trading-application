import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {

        // Get the auth token from the service.
        // tslint:disable-next-line:max-line-length
        const authToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1YjNjZDllMWM0OTc3NTFhZWMyZDU3NDQifQ.AVNonV_Gh3IdeSDRJdlwnyS155qm5xsSNzuNQZcqXTk';

        // Clone the request and replace the original headers with
        // cloned headers, updated with the authorization.
        const authReq = req.clone({
            headers: req.headers.set('token', authToken)
        });

        // send cloned request with header to the next handler.
        return next.handle(authReq);
    }
}