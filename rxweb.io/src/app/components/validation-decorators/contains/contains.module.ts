import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HighlightModule } from 'ngx-highlightjs';
import { ClipboardModule } from 'ngx-clipboard';
import { CONTAINS_ROUTING } from './contains.routing';
import { ContainsComponent } from './contains.component';
import { ContainsExtendedModule } from '../../../../assets/examples/reactive-form-validators/decorators/contains/contains.module';
import { DisqusSharedModule } from "src/app/components/shared/disqus/disqus-shared.module";
import { RightSideBarSharedModule } from "src/app/components/shared/right-sidebar/right-sidebar-shared.module";
import { TitleCasePipe } from "@angular/common";

@NgModule({
  imports: [
    CONTAINS_ROUTING,
    CommonModule, FormsModule, ReactiveFormsModule, HighlightModule, ContainsExtendedModule, ClipboardModule,DisqusSharedModule,RightSideBarSharedModule],
  declarations: [ContainsComponent],
  exports: [RouterModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers:[TitleCasePipe]
})
export class ContainsModule { }
