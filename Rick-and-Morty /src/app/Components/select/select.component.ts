import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',

})
export class SelectComponent {
  private _valueSelectStatus: string = '';

  @Input()
  get valueSelectStatus(): string {
    return this._valueSelectStatus;
  }
  set valueSelectStatus(value: string) {
    if (this._valueSelectStatus !== value) {
      this._valueSelectStatus = value;
      this.valueSelectStatusChange.emit(value);
    }
  }

  @Output() valueSelectStatusChange: EventEmitter<string> =
    new EventEmitter<string>();
}
