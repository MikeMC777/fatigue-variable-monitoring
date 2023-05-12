import { SocketWebService } from 'src/app/services/socket-web.service';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChangeService } from 'src/app/services/change.service';
import { DataForLineChartI } from 'src/app/models/dataForLineChart';

@Component({
  selector: 'fvm-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  multi: DataForLineChartI [];

  //Opciones
  legend: boolean = false;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Tiempo';
  yAxisLabel: string = 'Valor';
  timeline: boolean = true;

  colorScheme = {
    domain: []
  }
  @Input() data!: DataForLineChartI [];

  subscription!: Subscription;


  constructor(private changeService : ChangeService) {
    this.multi = this.data;

  }

  ngOnInit(): void {
    this.subscription = this.changeService.change$.subscribe(() => this.multi = this.data);

  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
 }

  onSelect(event: any) {

  }

  onActivate(event: any) {

  }

  onDeactivate(event: any) {

  }
}
