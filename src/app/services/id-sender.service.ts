import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdSenderService {

  _uuid: string = '';
  id: number = 0;
  state: string = '';
  object: any;
  private sendIdSubject = new Subject<{ id: number }>();
  sendIdObservable = this.sendIdSubject.asObservable();

  private sendUUIDSubject = new Subject<{ _uuid: string }>();
  sendUUIDObservable = this.sendIdSubject.asObservable();

  private sendStateSubject = new Subject<{ state: string }>();
  sendStateObservable = this.sendStateSubject.asObservable();

  private sendSubjectObject = new Subject<{ obj: any }>();
  sendObjectObservable = this.sendSubjectObject.asObservable();

  //Almacenar ID
  sendId(id: number) {
    this.id = id;
    this.sendIdSubject.next({id});
  }

  //Almacenar UUID
  sendUUID(_uuid: string) {
    this._uuid = _uuid;
    this.sendUUIDSubject.next({_uuid});
  }
  //Almacenar estado
  sendState(state: string) {
    this.state = state;
    this.sendStateSubject.next({ state });
  }
  //Almacenar objeto por código
  sendObjectByCode(obj: any) {
    this.object = obj;
    this.sendSubjectObject.next({ obj })
  }
}
