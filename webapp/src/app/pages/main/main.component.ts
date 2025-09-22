import {Component, EventEmitter, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {IconComponent} from "@AppComponents/icon/icon.component";
import {StepperComponent} from "@AppComponents/stepper/stepper.component";
import {StepperSet} from "@AppComponents/stepper/stepper.utils";
import {REGEX_VALIDATION_PATTERNS} from "@AppConstants/regex.constants";
import {GenerateCodeComponent} from "@AppPages/generate-code/generate-code.component";
import {RegisterComponent} from "@AppPages/register/register.component";
import {ValidateCodeComponent} from "@AppPages/validate-code/validate-code.component";
import {AuthenticationService} from "@AppServices/authentication.service";

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

  private readonly fb = inject(FormBuilder);

  protected readonly registerUserFormControl: FormControl = new FormControl(null, [Validators.required, Validators.pattern(REGEX_VALIDATION_PATTERNS.email)]);
  protected readonly validateCodeFormControl: FormControl = new FormControl(null, [Validators.required, Validators.requiredTrue]);

  private readonly userFormGroup: FormGroup = this.fb.group({
    token: [null],
    code: this.validateCodeFormControl,
    email: this.registerUserFormControl
  });

  private readonly _authenticationService = inject(AuthenticationService);

  protected events = {
    registerAccount: new EventEmitter(),
    registerQr: new EventEmitter(),
    ValidateAuth: new EventEmitter(),
  }
  protected status = {
    registerAccount: false,
    registerQr: false,
    ValidateAuth: false
  }
  private windows = ["registerAccount", "registerQr", "ValidateAuth"];
  private _activeWindow: "registerAccount" | "registerQr" | "ValidateAuth" = 'registerAccount';
  protected startRedirect = false;

  steps: StepperSet = [
    {
      name: 'registerAccount',
      displayName: 'Registro de Cuenta',
      value: false,
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

  protected get token(){
    const token: string | null = this.userFormGroup.get("token")!.value??null;
    return token;
  }

  protected prev() {
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

  protected next() {
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

  private markAsDone(str: "registerAccount" | "registerQr" | "ValidateAuth") {
    this.status[str] = true;
    this.steps.find(y => y.name == str)!.value = true
    this.next()
  }

  protected set activeWindow(str: "registerAccount" | "registerQr" | "ValidateAuth") {
    if (this.status[this._activeWindow])
      this._activeWindow = str
  }

  protected get activeWindow(): "registerAccount" | "registerQr" | "ValidateAuth" {
    return this._activeWindow;
  }

  protected submitUser() {
    if (this.registerUserFormControl.invalid) return;

    this._authenticationService.registerUser(this.registerUserFormControl.value)
      .subscribe(response => {
        this.userFormGroup.get('token')!.setValue(response);
        this.markAsDone('registerAccount');
        this.startAutomaticValidation();
      });
  }

  private startAutomaticValidation() {
    let token: string = this.userFormGroup.get('token')!.value;
    if (token)
      this._authenticationService.checkScannedStatus(token)
        .subscribe(status => {
          this.startRedirect = true
        })
  }

  protected submitScanned() {
    this.markAsDone('registerQr');
  }

  protected validateCode(code: string) {
    this._authenticationService.validateCode(Number(code), this.registerUserFormControl.value)
      .subscribe(response => {
        this.validateCodeFormControl.setValue(response.valid);
        this.markAsDone('ValidateAuth');
      })
  }

}
