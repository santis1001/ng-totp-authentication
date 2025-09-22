import {HttpClient} from "@angular/common/http";
import {Component, effect, inject, Input, input, signal, WritableSignal} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-icon',
  imports: [],
  template: '<div [innerHTML]="fileContent()"></div>',
  standalone: true
})
export class IconComponent {
  private _iconPath: WritableSignal<string> = signal<string>('');
  readonly fileContent = signal<SafeHtml | null>(null);

  private domSanitizer = inject(DomSanitizer);
  private http = inject(HttpClient);

  /**
   * set icon name
   * file: `check.svg`
   *
   * icon name is `check` remove the `.svg` extension
   * */
  @Input({ required: true })
  set icon(value: string) {
    this._iconPath.set(value + '.svg');
  }

  constructor() {
    effect(() => {
      const filePath = this._iconPath();
      if (filePath) {
        this.http.get(filePath, {responseType: 'text'}).subscribe({
          next: (data) => {
            if (data) {
              const content = this.domSanitizer.bypassSecurityTrustHtml(data);
              this.fileContent.set(content);
            }
          },
        });
      } else {
        this.fileContent.set('');
      }
    });
  }

}
