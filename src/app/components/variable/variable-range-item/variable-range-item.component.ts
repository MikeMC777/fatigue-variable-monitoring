import { VariableRangeI } from './../../../models/variable';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'fvm-variable-range-item',
  templateUrl: './variable-range-item.component.html',
  styleUrls: ['./variable-range-item.component.scss']
})
export class VariableRangeItemComponent implements OnInit {

  @Input() data!: VariableRangeI;
  /*Lista de rangos de variable existentes*/
  @Input() variableRangeList!: VariableRangeI[];

  @Output() remove: EventEmitter<string> = new EventEmitter<string>();
  @Output() add: EventEmitter<VariableRangeI> = new EventEmitter<VariableRangeI>();
  rangeFormGroup = new FormGroup({
    min_age: new FormControl('', [Validators.required, Validators.min(0)]),
    max_age: new FormControl('', [Validators.required, Validators.min(0), Validators.max(150)]),
    min_range: new FormControl('', [Validators.required]),
    max_range: new FormControl('', [Validators.required])
  }, {validators: this.hasValidRanges()})

  constructor() { }

  ngOnInit(): void {
    this.loadRange();
  }

  /*eliminar rango de variable */
  onDelete(): void {
    this.remove.emit(this.data._uuid);
  }
  /*asociar rango de variable */
  onAdd(): void {
    const rangeItem: VariableRangeI = {
      id: this.data.id,
      _uuid: this.data._uuid,
      variable_id: this.data.variable_id,
      min_age: this.rangeFormGroup.value.min_age,
      max_age: this.rangeFormGroup.value.max_age,
      min_range: this.rangeFormGroup.value.min_range,
      max_range: this.rangeFormGroup.value.max_range,
    }
    this.add.emit(rangeItem);
  }

  loadRange(): any {
    this.minAge.setValue(this.data.min_age);
    this.maxAge.setValue(this.data.max_age);
    this.minRange.setValue(this.data.min_range);
    this.maxRange.setValue(this.data.max_range);
    this.isDisabled();
  }

  get minAge(): any {
    return this.rangeFormGroup.get('min_age');
  }
  get maxAge(): any {
    return this.rangeFormGroup.get('max_age');
  }
  get minRange(): any {
    return this.rangeFormGroup.get('min_range');
  }
  get maxRange(): any {
    return this.rangeFormGroup.get('max_range');
  }

  isDisabled() {
    if (!!this.data._uuid) {
      this.minAge.disable();
      this.maxAge.disable();
      this.minRange.disable();
      this.maxRange.disable();
    }
  }

  hasValidRanges(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isInvalid = control.value['min_age'] > control.value['max_age'] ||
        control.value['min_range'] > control.value['max_range'] || this.validateOtherRanges(control);
      return isInvalid ? {validRanges: false} : null;
    };
  };

  validateOtherRanges(control: AbstractControl): boolean {
    if (!!this.variableRangeList) {
      for (let variableRange of this.variableRangeList) {
        if ((control.value['min_age'] >= variableRange.min_age && control.value['min_age'] <= variableRange.max_age)
            || (control.value['max_age'] >= variableRange.min_age && control.value['max_age'] <= variableRange.max_age)) {
          return true;
        }
      }
    }
    return false;
  }
}

