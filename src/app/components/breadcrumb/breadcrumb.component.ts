import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdSenderService } from 'src/app/services/id-sender.service';

@Component({
  selector: 'fvm-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  _id: string = '';
  id: number = 0;
  itemBreadCrumb: string;
  //Objeto de uso general
  objectG: any;

  constructor(public router: Router, public idSender: IdSenderService) {
    this.itemBreadCrumb = '';
  }

  ngOnInit() {
    this.idSender.sendIdObservable.subscribe(res => {
      this.id = res.id;
    });
    //Almacenamos el valor de un objeto cualquiera
    this.idSender.sendObjectObservable.subscribe(res => {
      /*Almacenamos el objeto */
      this.objectG = res.obj;
    });
  }
}

