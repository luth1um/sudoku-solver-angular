import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'solve-reset-dialog',
  templateUrl: './reset-dialog.component.html',
  styleUrl: './reset-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, TranslatePipe],
})
export class ResetDialogComponent {}
