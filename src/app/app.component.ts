import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { SudokuBoxComponent } from './sudoku-box/sudoku-box.component';

@Component({
  selector: 'solve-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [MatToolbarModule, MatButtonModule, MatCardModule, TranslateModule, SudokuBoxComponent],
})
export class AppComponent {
  private translate = inject(TranslateService);

  readonly title = 'sudoku-solver';
  readonly explanationLinkWiki = signal<string | undefined>(undefined);

  constructor() {
    this.translate.addLangs(['en', 'de']);
    this.translate.setFallbackLang('en');

    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang && browserLang.match(/en|de/) ? browserLang : 'en');

    this.translate.get('app.toolbar-explanation-wiki-link').subscribe((url: string) => {
      this.explanationLinkWiki.set(url);
    });
  }
}
