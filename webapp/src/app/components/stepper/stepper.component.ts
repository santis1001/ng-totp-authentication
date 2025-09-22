import {Component, Input, input, signal, WritableSignal} from '@angular/core';
import {IconComponent} from "@AppComponents/icon/icon.component";
import {StepperSet} from "@AppComponents/stepper/stepper.utils";

@Component({
  selector: 'app-stepper',
  imports: [
    IconComponent
  ],
  templateUrl: './stepper.component.html',
  standalone: true,
  styleUrl: './stepper.component.css'
})
export class StepperComponent {


  private _steps: WritableSignal<StepperSet | null> = signal(null);

  protected afterContent = 'md:w-full after:content-[\'\'] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700'
  protected afterContentAux = 'after:content-[\'/\'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500'
  protected activeContent = 'text-blue-600 dark:text-blue-500';


  get steps(): StepperSet | null {
    return this._steps()??[];
  }

  @Input()
  set steps(value: StepperSet) {
    this._steps.set(value);
  }

}
