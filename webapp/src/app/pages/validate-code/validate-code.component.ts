import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Button} from "@AppComponents/button/button";
import {CardComponent} from "@AppComponents/card/card.component";
import {ContainerComponent} from "@AppComponents/container/container.component";
import {REGEX_CHARS_ALLOWED} from "@AppConstants/regex.constants";

@Component({
  selector: 'app-validate-code',
  imports: [
    Button,
    CardComponent,
    ContainerComponent,
    FormsModule,
  ],
  templateUrl: './validate-code.component.html',
  standalone: true,
  styleUrl: './validate-code.component.css'
})
export class ValidateCodeComponent {

  protected readonly totpStyle = '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [appearance:textfield] shadow-xs flex w-[48px] items-center justify-center rounded-lg border border-stroke bg-white p-2 text-center text-2xl font-medium text-gray-200 outline-hidden sm:text-4xl dark:border-gray-500 dark:bg-white/10'

  protected readonly REGEX_CHARS_ALLOWED = REGEX_CHARS_ALLOWED;
  protected isValid = false;
  protected codeValidation = false;

  protected otp: string[] = ['', '', '', '', '', ''];

  protected get totpValue(): string {
    return this.otp.join('');
  }

  @Output()
  submitted = new EventEmitter<string>();
  protected saved = false;

  submit() {
    if(this.totpValue.length == 6)
    this.submitted.emit(this.totpValue);
    this.saved = true
  }

  @Input()
  set validationResponse(value: boolean){
    this.codeValidation = value
  }

}
