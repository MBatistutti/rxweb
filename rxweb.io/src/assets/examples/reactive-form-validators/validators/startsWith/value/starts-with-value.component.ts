import { Component, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms"

import { RxFormBuilder,RxwebValidators
} from '@rxweb/reactive-form-validators';

@Component({
    selector: 'app-startsWith-value-validator',
    templateUrl: './starts-with-value.component.html'
})
export class StartsWithValueValidatorComponent implements OnInit {
    userFormGroup: FormGroup
					
					
					
	    constructor(
        private formBuilder: RxFormBuilder
    ) { }

    ngOnInit() {
        this.userFormGroup = this.formBuilder.group({
										name:['', RxwebValidators.startsWith({value:'J'  ,message:'{{0}} does not starts with `J`' })], 
													taskId:['', RxwebValidators.startsWith({value:'#'  ,conditionalExpression:'x => x.name =="John"' })], 
													profession:['', RxwebValidators.startsWith({value:'Senior'  ,conditionalExpression:(x,y) => x.name == "John"  })], 
								});
    }
}