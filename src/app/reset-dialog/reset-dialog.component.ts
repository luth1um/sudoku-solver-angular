import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'solve-reset-dialog',
  templateUrl: './reset-dialog.component.html',
  styleUrls: ['./reset-dialog.component.scss'],
  standalone: false,
})
export class ResetDialogComponent {
  private dialogRef = inject<MatDialogRef<ResetDialogComponent>>(MatDialogRef);
}
