import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'fvm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public router: Router) {
  }
  title = 'fatigue-variable-monitoring';
}
