import {booleanAttribute, Component, Input, input, InputSignal, signal, ViewChild, WritableSignal} from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css'
})
export class Button {

  private _type: WritableSignal<'Default' | 'Alternative' | 'Disable' | 'Dark' | 'Light' | 'Green' | 'Red' | 'Yellow' | 'Purple'> = signal('Default');
  rounded = input(true, {transform: booleanAttribute});
  disabled = input(false, {transform: booleanAttribute});
  @ViewChild('buttonElement')
  buttonElement!: HTMLButtonElement;

  @Input({transform: booleanAttribute})
  focus() {
    if (this.buttonElement)
      this.buttonElement.focus();
  }

  @Input()
  set type(type: 'Default' | 'Alternative' | 'Disable' | 'Dark' | 'Light' | 'Green' | 'Red' | 'Yellow' | 'Purple') {
    this._type.set(type);
  }

  get type() {
    return this._type();
  }

  get style() {
    return [
      'w-full',
      (this.disabled()) ? this.buttonStyles['Disable'] : this.buttonStyles[this.type],
      this.roundedStyle
    ].join(' ');
  }

  private get roundedStyle() {
    return (this.rounded()) ? 'rounded-full' : 'rounded-lg'
  }

  private buttonStyles = {
    Default: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800',
    Alternative: 'py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700',
    Disable: 'py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 ',
    Dark: 'text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700',
    Light: 'text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700',
    Green: 'focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800',
    Red: 'focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900',
    Yellow: 'focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900',
    Purple: 'focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900',
  }
}
