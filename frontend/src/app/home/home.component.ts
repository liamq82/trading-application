import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cusip } from './cusip';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  cusips: Cusip[];

  constructor(private route: ActivatedRoute, private router: Router) {
    console.log('home component created!');
  }

  ngOnInit() {
    console.log('home component ngOnInit called!');

    this.route.data
      .subscribe((data: { cusips: Cusip[] }) => {
        this.cusips = data.cusips;
        console.log('pre fetched cusips ', this.cusips)
      });
  }

}
