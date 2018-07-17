import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Cusip } from './cusip';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let activatedRouteStub: MockActivatedRoute;
  const fakeRouter = {} as Router;

  beforeEach(async(() => {
    activatedRouteStub = new MockActivatedRoute();
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRouteStub
        },
        {
          provide: Router,
          useValue: fakeRouter
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/**
 * Mock activated route to supply mock cusips to the home component
 * on initialisation.
 */
class MockActivatedRoute {

  mockCusips = [
    new Cusip('X234NCO34'),
    new Cusip('HOT34554'),
    new Cusip('TAO435435S'),
  ];

  data = of(
    {
      cusips: this.mockCusips
    }
  );
}