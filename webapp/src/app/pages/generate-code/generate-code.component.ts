import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Button} from "@AppComponents/button/button";
import {CardComponent} from "@AppComponents/card/card.component";
import {ContainerComponent} from "@AppComponents/container/container.component";
import {InputComponent} from "@AppComponents/input/input.component";
import {apiConfig} from "@AppConstants/api.config";

@Component({
  selector: 'app-generate-code',
  imports: [
    CardComponent,
    ContainerComponent,
    Button,
  ],
  templateUrl: './generate-code.component.html',
  styleUrl: './generate-code.component.css'
})
export class GenerateCodeComponent {

  @Input()
  token: string | null = null;

  @Output()
  submitted = new EventEmitter<void>();

  private readonly API_CONFIG = apiConfig;
  protected saved = false;

  get imageUrl() {
    return this.token ? this.API_CONFIG.image(this.token) : null
  }

  submit() {
    this.submitted.emit();
  }
}
