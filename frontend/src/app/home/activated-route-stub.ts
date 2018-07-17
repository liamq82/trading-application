// export for convenience.
export { ActivatedRoute } from '@angular/router';

import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { ReplaySubject, of } from 'rxjs';
import { Cusip } from './cusip';

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */
export class ActivatedRouteStub {

    cusip = new Cusip('1');

    data = of({ cusips: [this.cusip] });

    // Use a ReplaySubject to share previous values with subscribers
    // and pump new values into the `paramMap` observable
    private subject = new ReplaySubject<ParamMap>();

    constructor(initialParams?: Params) {
        this.setParamMap(initialParams);
    }


    /** The mock paramMap observable */
    readonly paramMap = this.subject.asObservable();

    /** Set the paramMap observables's next value */
    setParamMap(params?: Params) {
        this.subject.next(convertToParamMap(params));
    };
}
