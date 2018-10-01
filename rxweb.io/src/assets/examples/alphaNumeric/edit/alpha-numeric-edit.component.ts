import { Component, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms"
import { HttpClient } from '@angular/common/http';

import { RxFormBuilder } from '@rxweb/reactive-form-validators';

import { Location } from './location.model';

@Component({
    selector: 'app-alphanumeric-edit',
    templateUrl: './alpha-numeric-edit.component.html'
})
export class AlphaNumericEditComponent implements OnInit {

    locationFormGroup: FormGroup

    constructor(
        private formBuilder: RxFormBuilder,		private http: HttpClient

    ) { }

    ngOnInit() {
        this.http.get('assets/examples/alphanumeric/edit/location-data.json').subscribe(location => {
            this.locationFormGroup = this.formBuilder.formGroup<Location>(Location,location);
        })
    }
}