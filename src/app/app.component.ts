import { Component, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'solve-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private translate = inject(TranslateService);

  title = 'sudoku-solver';
  explanationLinkWiki?: string;

  constructor() {
    const translate = this.translate;

    translate.addLangs(['en', 'de']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang && browserLang.match(/en|de/) ? browserLang : 'en');
  }

  ngOnInit(): void {
    this.translate.get('app.toolbar-explanation-wiki-link').subscribe((url: string) => {
      this.explanationLinkWiki = url;
    });
  }
}
