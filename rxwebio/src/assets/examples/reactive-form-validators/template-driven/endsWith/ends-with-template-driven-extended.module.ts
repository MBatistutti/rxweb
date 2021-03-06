import { CommonModule } from '@angular/common';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';

import { EndsWithCompleteTemplateDrivenComponent } from './complete/ends-with-complete.component';
import { EndsWithValueTemplateDrivenComponent } from './value/ends-with-value.component';
import { EndsWithConditionalExpressionTemplateDrivenComponent } from './conditionalExpression/ends-with-conditional-expression.component';
import { EndsWithMessageTemplateDrivenComponent } from './message/ends-with-message.component';
import { EndsWithAddTemplateDrivenComponent } from './add/ends-with-add.component';

@NgModule({
  declarations: [
	EndsWithCompleteTemplateDrivenComponent,
	EndsWithValueTemplateDrivenComponent,
	EndsWithConditionalExpressionTemplateDrivenComponent,
	EndsWithMessageTemplateDrivenComponent,
	EndsWithAddTemplateDrivenComponent,
  ],
entryComponents: [
	EndsWithCompleteTemplateDrivenComponent,
	EndsWithValueTemplateDrivenComponent,
	EndsWithConditionalExpressionTemplateDrivenComponent,
	EndsWithMessageTemplateDrivenComponent,
	EndsWithAddTemplateDrivenComponent,
  ],
  imports: [
    CommonModule,HttpClientModule,ReactiveFormsModule,FormsModule,RxReactiveFormsModule
  ],
  providers: [],
  bootstrap: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
	EndsWithCompleteTemplateDrivenComponent,
	EndsWithValueTemplateDrivenComponent,
	EndsWithConditionalExpressionTemplateDrivenComponent,
	EndsWithMessageTemplateDrivenComponent,
	EndsWithAddTemplateDrivenComponent,
  ],

})
export class  EndsWithTemplateDrivenExtendedModule { }
