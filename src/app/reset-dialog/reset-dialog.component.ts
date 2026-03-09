import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'solve-reset-dialog',
  templateUrl: './reset-dialog.component.html',
  styleUrl: './reset-dialog.component.scss',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, TranslateModule],
})
export class ResetDialogComponent {}
