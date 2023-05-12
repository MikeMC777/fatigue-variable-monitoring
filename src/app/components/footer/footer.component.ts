import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fvm-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  date: Date = new Date();
  currentYear: number = this.date.getFullYear();

  constructor() { }

  ngOnInit(): void {
  }

}
