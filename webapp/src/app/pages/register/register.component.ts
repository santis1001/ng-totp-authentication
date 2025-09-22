import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Button} from "@AppComponents/button/button";
import {CardComponent} from "@AppComponents/card/card.component";
import {ContainerComponent} from "@AppComponents/container/container.component";
import {InputComponent} from "@AppComponents/input/input.component";

@Component({
  selector: 'app-register',
  imports: [
    CardComponent,
    ContainerComponent,
    InputComponent,
    Button,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, AfterViewInit{

  @Input()
  formControl!: FormControl;

  @Output()
  submitted = new EventEmitter<void>();
  protected saved = false;

  ngOnInit(): void {
    if(this.formControl.valid)
      this.saved = true
  }

  ngAfterViewInit(): void {
  }

  submit(){
    console.log(this.formControl.value)
    if(this.formControl.valid)
      this.submitted.emit();
  }
}
