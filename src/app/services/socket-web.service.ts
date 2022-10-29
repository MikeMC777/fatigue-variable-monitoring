import { environment } from './../../environments/environment';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class SocketWebService extends Socket{
  @Output() outEvent: EventEmitter<any> = new EventEmitter();

  constructor() {
    super({
      url: environment.apiUrl
    })
    this.listen();
  }

  listen(): void {
    this.ioSocket.on('event-insert-plot-sent', (res: any) => {
      this.outEvent.emit(res)
    })
  }
}
