import {NgModule} from '@angular/core';
import {MatButtonModule, MatFormFieldModule, MatSelectModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    BrowserAnimationsModule
  ],
  exports: [
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    BrowserAnimationsModule
  ]
})
export class MaterialModule {
}
