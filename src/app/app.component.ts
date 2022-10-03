import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'solve-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'sudoku-solver';
  explanationLinkWiki?: string;

  constructor(private translate: TranslateService) {
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
