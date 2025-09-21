import {Component, EventEmitter, Output} from '@angular/core';
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
  ],
  templateUrl: './validate-code.component.html',
  styleUrl: './validate-code.component.css'
})
export class ValidateCodeComponent {

  protected readonly totpStyle = '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [appearance:textfield] shadow-xs flex w-[64px] items-center justify-center rounded-lg border border-stroke bg-white p-2 text-center text-2xl font-medium text-gray-200 outline-hidden sm:text-4xl dark:border-gray-500 dark:bg-white/10'

  protected readonly REGEX_CHARS_ALLOWED = REGEX_CHARS_ALLOWED;
  protected isValid = false;
  protected codeValidation = false;

  @Output()
  submitted = new EventEmitter<void>();
  protected saved = false;

  submit() {
    this.submitted.emit();
  }

}
