import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {IconComponent} from "@AppComponents/icon/icon.component";
import {StepperComponent} from "@AppComponents/stepper/stepper.component";
import {StepperSet} from "@AppComponents/stepper/stepper.utils";
import {REGEX_VALIDATION_PATTERNS} from "@AppConstants/regex.constants";
import {GenerateCodeComponent} from "@AppPages/generate-code/generate-code.component";
import {RegisterComponent} from "@AppPages/register/register.component";
import {ValidateCodeComponent} from "@AppPages/validate-code/validate-code.component";

@Component({
  selector: 'app-main',
  imports: [
    RegisterComponent,
    StepperComponent,
    IconComponent,
    GenerateCodeComponent,
    ValidateCodeComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  readonly registerUserFormControl: FormControl = new FormControl('null@null.com', [Validators.required, Validators.pattern(REGEX_VALIDATION_PATTERNS.email)]);

  protected events = {
    registerAccount: new EventEmitter(),
    registerQr: new EventEmitter(),
    ValidateAuth: new EventEmitter(),
  }
  protected status = {
    registerAccount: true,
    registerQr: false,
    ValidateAuth: false
  }
  private windows = ["registerAccount", "registerQr", "ValidateAuth"];
  private _activeWindow: "registerAccount" | "registerQr" | "ValidateAuth" = 'registerAccount';

  steps: StepperSet = [
    {
      name: 'registerAccount',
      displayName: 'Registro de Cuenta',
      value: true,
      event: () => this.events.registerAccount.emit()
    },
    {
      name: 'registerQr',
      displayName: 'Escanee el QR',
      value: false,
      event: () => this.events.registerQr.emit()
    },
    {
      name: 'ValidateAuth',
      displayName: 'Validar Codigo',
      value: false,
      event: () => this.events.ValidateAuth.emit()
    }
  ]

  ngOnInit(): void {

    this.events.registerAccount.subscribe(_ => {
      console.log("Event: registerAccount");
      this.activeWindow = 'registerAccount';
    })
    this.events.registerQr.subscribe(_ => {
      console.log("Event: registerQr");
      this.activeWindow = 'registerQr';
    })
    this.events.ValidateAuth.subscribe(_ => {
      console.log("Event: ValidateAuth");
      this.activeWindow = 'ValidateAuth';
    })

  }

  prev() {
    console.log('click')
    switch (this.activeWindow) {
      case "registerAccount":
        break;
      case "registerQr":
        this._activeWindow = 'registerAccount'
        break;
      case "ValidateAuth":
        this._activeWindow = 'registerQr'
        break;
    }
  }

  next() {
    console.log('click')
    switch (this.activeWindow) {
      case "registerAccount":
        this.activeWindow = 'registerQr'
        break;
      case "registerQr":
        this.activeWindow = 'ValidateAuth'
        break;
      case "ValidateAuth":
        break;
    }
  }

  markAsDone(str: "registerAccount" | "registerQr" | "ValidateAuth") {
    this.status[str] = true;
    this.steps.find(y => y.name == str)!.value = true
    this.next()
  }

  set activeWindow(str: "registerAccount" | "registerQr" | "ValidateAuth") {
    if (this.status[this._activeWindow])
      this._activeWindow = str
  }

  get activeWindow(): "registerAccount" | "registerQr" | "ValidateAuth" {
    return this._activeWindow;
  }
}
