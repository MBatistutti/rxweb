import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HighlightModule } from 'ngx-highlightjs';
import { ClipboardModule } from 'ngx-clipboard';
import { MIN_DATE_ROUTING } from './minDate.routing';
import { MinDateComponent } from './minDate.component';
import { MinDateExtendedModule } from 'src/assets/examples/reactive-form-validators/decorators/minDate/minDate.module';
import { DisqusSharedModule } from "src/app/components/shared/disqus/disqus-shared.module";
import { RightSideBarSharedModule } from "src/app/components/shared/right-sidebar/right-sidebar-shared.module";
import { MergeDashPipe } from "src/app/pipes/merge-dash.pipe";

@NgModule({
  imports: [
    MIN_DATE_ROUTING,
    CommonModule, FormsModule, ReactiveFormsModule, HighlightModule, MinDateExtendedModule, ClipboardModule,DisqusSharedModule,RightSideBarSharedModule],
  declarations: [MinDateComponent],
  exports: [RouterModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers:[MergeDashPipe]
})
export class MinDateDecoratorsModule { }

