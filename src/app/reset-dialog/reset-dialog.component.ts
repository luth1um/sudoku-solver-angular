import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'solve-reset-dialog',
  templateUrl: './reset-dialog.component.html',
  styleUrls: ['./reset-dialog.component.scss'],
})
export class ResetDialogComponent {
  constructor(private dialogRef: MatDialogRef<ResetDialogComponent>) {}
}
