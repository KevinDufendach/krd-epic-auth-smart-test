import {NgModule} from '@angular/core';
import {MatButtonModule, MatFormFieldModule, MatSelectModule} from '@angular/material';


@NgModule({
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  exports: [
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class MaterialModule {
}
