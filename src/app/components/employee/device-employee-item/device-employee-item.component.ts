import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AvailableDeviceI } from 'src/app/models/device';
import { EmployeeDeviceI } from 'src/app/models/employee';

@Component({
  selector: 'fvm-device-employee-item',
  templateUrl: './device-employee-item.component.html',
  styleUrls: ['./device-employee-item.component.scss']
})
export class DeviceEmployeeItemComponent implements OnInit {
  @Input() data!: EmployeeDeviceI;
  /*Tamaño de la lista de dispositivos asociados al empleado*/
  @Input() employeeDeviceList!: EmployeeDeviceI[];
  //Elementos de servicio para uso general
  @Input() deviceOptions!: AvailableDeviceI[];

  @Output() remove: EventEmitter<string> = new EventEmitter<string>();
  @Output() add: EventEmitter<number> = new EventEmitter<number>();
  deviceFormGroup = new UntypedFormGroup({
    device: new UntypedFormControl('', [Validators.required])
  })

  constructor() { }

  ngOnInit(): void {
  }

  //Cambiar valor del select
  onChangeSelect(): void{
    let selectChange: AvailableDeviceI[] = [];
    selectChange = this.deviceOptions.filter((element: AvailableDeviceI) => element.id == this.device.value);

    if (selectChange[0].id) { this.data.device_id = selectChange[0].id }
    if (selectChange[0].name) { this.data.device_name = selectChange[0].name }
  }

  /*eliminar dispositivo */
  onDelete(): void {
    this.remove.emit(this.data._uuid);
  }
  /*asociar dispositivo */
  onAdd(): void {
    this.add.emit(this.data.device_id);
  }

  get device(): any {
    return this.deviceFormGroup.get('device');
  }

}
