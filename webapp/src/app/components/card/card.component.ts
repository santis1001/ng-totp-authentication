import {Component, input, InputSignal} from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

  ngTitle: InputSignal<string> = input('');
  subtitle: InputSignal<string> = input('');
  ngStyle: InputSignal<string> = input('');
}
