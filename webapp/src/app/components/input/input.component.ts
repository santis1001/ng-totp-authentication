import {
  AfterViewInit, booleanAttribute,
  Component, ElementRef,
  EventEmitter,
  forwardRef, Input,
  input,
  Output,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator
} from "@angular/forms";
import {generateUuid} from "app/functions/generate-uuid.function";

@Component({
  selector: 'app-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    }
  ],
  standalone: true,
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent implements ControlValueAccessor, AfterViewInit, Validator {

  label = input<string | null>(null);
  placeholder = input<string>('');
  vertical = input(true, {transform: booleanAttribute});
  isPassword = input(false, {transform: booleanAttribute});
  isCurrency = input(false, {transform: booleanAttribute});
  type = input<"text" | "date" | "password" | "number">('text');

  @Input()
  isInvalid = false;
  protected style = "block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
  protected uuid = generateUuid();

  @Input({transform: booleanAttribute}) ngDisabled = false;

  @ViewChild('textInputRef') inputRef!: ElementRef<HTMLInputElement>;

  @Input()
  set value(val: string) {
    console.log(val)
    this._value = val;
    this.onChange(val);
  }

  get value(): string {
    return this._value;
  }

  constructor() {
  }

  ngAfterViewInit(): void {

  }

  @Output() valueChange = new EventEmitter<string>();

  protected _value: string = '';

  protected onChange = (_: any) => {
  };
  protected onTouched = () => {
  };

  updateValue(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this._value = newValue;
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }

  writeValue(value: any): void {
    this._value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Optional: you can wire this to a `[disabled]` input
  }

  validate(control: AbstractControl) {
    // return null if valid, or {errorName: true} if invalid
    this.isInvalid = control.invalid && control.touched;
    return control.valid ? null : control.errors
  }

  registerOnValidatorChange() {

  }

  showError() {
    return this.isInvalid
  }

}
