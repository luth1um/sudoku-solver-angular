import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        TranslateModule.forRoot({
          loader: provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json' }),
          fallbackLang: 'en',
        }),
      ],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  it('should create the app', () => {
    // Arrange + Act
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // Assert
    expect(app).toBeTruthy();
  });

  it(`should have as title 'sudoku-solver'`, () => {
    // Arrange + Act
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // Assert
    expect(app.title).toEqual('sudoku-solver');
  });
});
