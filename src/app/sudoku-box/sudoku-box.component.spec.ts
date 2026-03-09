import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { SudokuBoxComponent } from './sudoku-box.component';

describe('SudokuBoxComponent', () => {
  let component: SudokuBoxComponent;
  let fixture: ComponentFixture<SudokuBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SudokuBoxComponent,
        TranslateModule.forRoot({
          loader: provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json' }),
          fallbackLang: 'en',
        }),
      ],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(SudokuBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
