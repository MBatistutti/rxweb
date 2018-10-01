import { Component, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms"
import { HttpClient } from '@angular/common/http';

import { RxFormBuilder } from '@rxweb/reactive-form-validators';

import { SubjectDetails } from './subject-details.model';

@Component({
    selector: 'app-maxnumber-edit',
    templateUrl: './max-number-edit.component.html'
})
export class MaxNumberEditComponent implements OnInit {

    subjectDetailsFormGroup: FormGroup

    constructor(
        private formBuilder: RxFormBuilder,		private http: HttpClient

    ) { }

    ngOnInit() {
        this.http.get('assets/examples/maxnumber/edit/subject-details-data.json').subscribe(subjectDetails => {
            this.subjectDetailsFormGroup = this.formBuilder.formGroup<SubjectDetails>(SubjectDetails,subjectDetails);
        })
    }
}