import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Button} from "@AppComponents/button/button";
import {CardComponent} from "@AppComponents/card/card.component";
import {ContainerComponent} from "@AppComponents/container/container.component";
import {IconComponent} from "@AppComponents/icon/icon.component";
import {InputComponent} from "@AppComponents/input/input.component";
import {apiConfig} from "@AppConstants/api.config";
import {interval, take} from "rxjs";

@Component({
  selector: 'app-generate-code',
  imports: [
    CardComponent,
    ContainerComponent,
    Button,
    IconComponent,
  ],
  templateUrl: './generate-code.component.html',
  styleUrl: './generate-code.component.css'
})
export class GenerateCodeComponent {


  private readonly API_CONFIG = apiConfig;
  private _doExternalSubmit = false;
  protected saved = false;


  @Input()
  token: string | null = null;

  @Input()
  set doExternalSubmit(value : boolean){
    this._doExternalSubmit = value;
    if(this._doExternalSubmit)
      this.startRedirect();
  }
  get doExternalSubmit(){
    return this._doExternalSubmit
  }

  @Output()
  submitted = new EventEmitter<void>();

  get imageUrl() {
    return this.token ? this.API_CONFIG.image(this.token) : null
  }

  submit() {
    this.submitted.emit();
  }

  startRedirect(){
    interval(5000)
      .pipe((take(2)))
      .subscribe(_=>{
        this.submit();
      })
  }
}
