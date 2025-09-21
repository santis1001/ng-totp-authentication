import {Component, EventEmitter, Output} from '@angular/core';
import {Button} from "@AppComponents/button/button";
import {CardComponent} from "@AppComponents/card/card.component";
import {ContainerComponent} from "@AppComponents/container/container.component";
import {InputComponent} from "@AppComponents/input/input.component";

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

  @Output()
  submitted = new EventEmitter<void>();
  protected saved = false;

  submit() {
    this.submitted.emit();
  }
}
