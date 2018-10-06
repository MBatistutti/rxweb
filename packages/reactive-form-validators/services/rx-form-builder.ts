import { Injectable } from "@angular/core"
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms"
import { Type, DecoratorName } from "../util"
import {BaseFormBuilder } from './base-form-builder';
import {
    alphaNumericValidator, alphaValidator, compareValidator, emailValidator, hexColorValidator, lowercaseValidator,
    maxDateValidator, maxNumberValidator, minDateValidator, minNumberValidator, containsValidator, uppercaseValidator,
    rangeValidator, patternValidator, requiredValidator, creditCardValidator, digitValidator,
    maxLengthValidator, minLengthValidator, passwordValidator, timeValidator, urlValidator, jsonValidator,
  greaterThanEqualToValidator, greaterThanValidator, lessThanEqualToValidator, lessThanValidator,
  choiceValidator,differentValidator, numericValidator,evenValidator,oddValidator,factorValidator,leapYearValidator,allOfValidator, oneOfValidator, noneOfValidator, macValidator
} from '../reactive-form-validators/index';

import { defaultContainer } from '../core/defaultContainer';
import { DecoratorConfiguration, InstanceContainer, PropertyInfo } from '../core/validator.interface';

import { FormBuilderConfiguration } from "../models"
import { ARRAY_PROPERTY, OBJECT_PROPERTY, PROPERTY } from "../const"
import { PropValidationConfig } from "../models/prop-validation-config";
import { AnnotationTypes } from "../core/validator.static";
import { conditionalChangeValidator } from "../reactive-form-validators/conditional-change.validator";
import { Linq } from '../util/linq'
import { BuilderForm} from './builder-form';


const APP_VALIDATORS: { [key: string]: Function } = {
    "alphaNumeric": alphaNumericValidator,
    "alpha": alphaValidator,
    "compare": compareValidator,
    "email": emailValidator,
    "hexColor": hexColorValidator,
    "lowerCase": lowercaseValidator,
    "maxDate": maxDateValidator,
    "maxNumber": maxNumberValidator,
    "minDate": minDateValidator,
    "minNumber": minNumberValidator,
    "contains": containsValidator,
    "upperCase": uppercaseValidator,
    "maxLength": maxLengthValidator,
    "minLength": minLengthValidator,
    "password": passwordValidator,
    "range": rangeValidator,
    "required": requiredValidator,
    "creditCard": creditCardValidator,
    "digit": digitValidator,
    "pattern": patternValidator,
    "time": timeValidator,
    "url": urlValidator,
    "json": jsonValidator,
    "greaterThan": greaterThanValidator,
    "greaterThanEqualTo": greaterThanEqualToValidator,
    "lessThan": lessThanValidator,
    "lessThanEqualTo": lessThanEqualToValidator,
    "choice": choiceValidator,
    "different": differentValidator,
    "numeric":numericValidator,
    "even":evenValidator,
    "odd":oddValidator,
    "factor":factorValidator,
    "leapYear":leapYearValidator,
    "allOf":allOfValidator,
    "oneOf":oneOfValidator,
    "noneOf":noneOfValidator,
    "mac":macValidator
}



@Injectable()
export class RxFormBuilder extends BaseFormBuilder {
    private nestedProp: string;
    private conditionalObjectProps: any[] = [];
    private conditionalValidationInstance: any = {};
    private builderConfigurationConditionalObjectProps: any[] = [];
    private formGroupPropOtherValidator :{[key:string]:any} = {};
    private currentFormGroupPropOtherValidator :{[key:string]:any} = {};
    private isNested: boolean = false;
    private formBuilder:BuilderForm
    constructor() {
      super()
     this.formBuilder = new BuilderForm();
    }

    

    private getInstanceContainer(instanceFunc: any): InstanceContainer {
        return defaultContainer.get(instanceFunc);
    }

    private setValue(formGroup: FormGroup, object: any): void {
        for (var col in object) {
            var control = formGroup.get([col]);
            control.setValue(object[col]);
            control.updateValueAndValidity();
        }
    }

    private extractExpressions(fomrBuilderConfiguration: FormBuilderConfiguration): { [key: string]: string[] } {
        if (fomrBuilderConfiguration && fomrBuilderConfiguration.validations) {
            for (var property in fomrBuilderConfiguration.validations) {
                for (var decorator in fomrBuilderConfiguration.validations[property]) {
                    if (fomrBuilderConfiguration.validations[property][decorator].conditionalExpression) {
                        let columns = Linq.expressionColumns(fomrBuilderConfiguration.validations[property][decorator].conditionalExpression);
                        defaultContainer.addChangeValidation(this.conditionalValidationInstance, property, columns);
                    }
                }
            }
        }
        return null;
    }

    private addFormControl(property: PropertyInfo, propertyValidators: DecoratorConfiguration[], propValidationConfig: PropValidationConfig, instance: InstanceContainer) {
        let validators = [];
        let columns = [];
        if ((instance.conditionalValidationProps && instance.conditionalValidationProps[property.name]) || (this.conditionalValidationInstance.conditionalValidationProps && this.conditionalValidationInstance.conditionalValidationProps[property.name])) {
            let props = [];
            if ((instance.conditionalValidationProps && instance.conditionalValidationProps[property.name]))
                instance.conditionalValidationProps[property.name].forEach(t => props.push(t))
            if (this.conditionalValidationInstance.conditionalValidationProps && this.conditionalValidationInstance.conditionalValidationProps[property.name])
                this.conditionalValidationInstance.conditionalValidationProps[property.name].forEach(t => props.push(t));
            validators.push(conditionalChangeValidator(props));
        }
        if (this.conditionalObjectProps.length > 0 || this.builderConfigurationConditionalObjectProps.length > 0) {
            let propConditions = [];
            if (this.conditionalObjectProps)
                propConditions = this.conditionalObjectProps.filter(t => t.propName == property.name);
            if (this.builderConfigurationConditionalObjectProps)
                this.builderConfigurationConditionalObjectProps.filter(t => t.propName == property.name).forEach(t => propConditions.push(t));
            propConditions.forEach(t => {
                if (t.referencePropName && columns.indexOf(t.referencePropName) == -1)
                    columns.push(t.referencePropName);
            })
            if (columns.length > 0)
                validators.push(conditionalChangeValidator(columns));
        }
        for (let propertyValidator of propertyValidators) {
            validators.push(APP_VALIDATORS[propertyValidator.annotationType](propertyValidator.config, ))
        }
        if (propValidationConfig)
            this.additionalValidation(validators, propValidationConfig);
        if(this.currentFormGroupPropOtherValidator[property.name]) 
            this.currentFormGroupPropOtherValidator[property.name].forEach(t=> { validators.push(t); })
        return validators;
    }

    private additionalValidation(validations: any[], propValidationConfig: PropValidationConfig) {
        for (var col in AnnotationTypes) {
            if (propValidationConfig[AnnotationTypes[col]] && col != "custom") {
                validations.push(APP_VALIDATORS[AnnotationTypes[col]](propValidationConfig[AnnotationTypes[col]]));
            }
            else if (col == AnnotationTypes.custom && propValidationConfig[AnnotationTypes[col]])
                validations.push(propValidationConfig[col]);
        }
    }

    private checkObjectPropAdditionalValidation<T>(instanceContainer: InstanceContainer, object: T) {
        var props = instanceContainer.properties.filter(t => t.propertyType == OBJECT_PROPERTY || t.propertyType == ARRAY_PROPERTY)
        props.forEach(t => {
            let instance = this.getInstanceContainer(t.entity);
            if (instance.conditionalValidationProps) {
                for (var key in instance.conditionalValidationProps) {
                    var prop = instance.properties.filter(t => t.name == key)[0];
                    if (!prop)
                        prop = instanceContainer.properties.filter(t => t.name == key)[0];
                    if (prop) {
                        if (!instanceContainer.conditionalValidationProps)
                            if (!instanceContainer.conditionalValidationProps[key])
                                instanceContainer.conditionalValidationProps[key] = [];
                        instance.conditionalValidationProps[key].forEach(x => {
                            if (t.propertyType != ARRAY_PROPERTY)
                                instanceContainer.conditionalValidationProps[key].push([t.name, x].join('.'))
                            else
                                instanceContainer.conditionalValidationProps[key].push([t.name, x].join('[]'))
                        })
                    }
                }
            }
        })
    }

    getObject(model: any | { [key: string]: any }, entityObject?: { [key: string]: any } | FormBuilderConfiguration, formBuilderConfiguration?: FormBuilderConfiguration): {[key:string]:any} {
        let json: { [key: string]: any } = {};

        if (typeof model == "function")
            json.model = model;

        if (entityObject && !(entityObject instanceof FormBuilderConfiguration))
            json.entityObject = entityObject;

        if (entityObject instanceof FormBuilderConfiguration && !formBuilderConfiguration)
            json.formBuilderConfiguration = entityObject;
        else if (!(entityObject instanceof FormBuilderConfiguration) && formBuilderConfiguration)
            json.formBuilderConfiguration = formBuilderConfiguration;
        
        if (!entityObject) {
            json.entityObject = model;
            if (typeof model == "object")
                json.model = model.constructor;
        } else if (model && (entityObject instanceof FormBuilderConfiguration) && (typeof model == "object")) {
            json["entityObject"] = model;
            json["model"] = model.constructor;
        }
        return json;
    }


    group(groupObject:{[key:string]:any}) : FormGroup{
        let modelInstance = super.createInstance();
        let entityObject = {};
        this.formGroupPropOtherValidator = {};
        this.currentFormGroupPropOtherValidator = this.formGroupPropOtherValidator;
        this.createValidatorFormGroup(groupObject,entityObject,modelInstance);
        this.currentFormGroupPropOtherValidator = this.formGroupPropOtherValidator;
        let formGroup = this.formGroup(modelInstance.constructor,entityObject);
        this.formGroupPropOtherValidator = {};
        this.currentFormGroupPropOtherValidator = this.formGroupPropOtherValidator;
        this.formGroupPropOtherValidator = {};
        return formGroup;
    }

    createValidatorFormGroup(groupObject:{[key:string]:any},entityObject:{[key:string]:any},modelInstance:any){
          for(var propName in groupObject){
            var prop = groupObject[propName];
            if(prop instanceof Array && prop.length > 0 && typeof prop[0] != "object")
            {
              let propValidators = (prop.length > 1 &&  prop[1] instanceof Array)? prop[1] : (prop.length == 2)? [prop[1]] : [];
              let propertyAdded :boolean = false;
              for(var i=0;i<propValidators.length;i++){
                if(propValidators[i].name == "rxwebValidator"){
                  propValidators[i](propName,modelInstance);
                  propertyAdded = true;
                }
                else{
                  if(!this.currentFormGroupPropOtherValidator[propName])
                    this.currentFormGroupPropOtherValidator[propName] = [];
                  this.currentFormGroupPropOtherValidator[propName].push(propValidators[i])
                }
              }
              if(!propertyAdded)
                defaultContainer.initPropertyObject(propName,PROPERTY,undefined, modelInstance.constructor ? modelInstance : {constructor:modelInstance});
            }else if(prop instanceof Array){
                if(prop instanceof FormArray){
                  entityObject[propName] = prop;
                } else {
                let propModelInstance = super.createInstance();
                defaultContainer.initPropertyObject(propName,ARRAY_PROPERTY,propModelInstance.constructor,modelInstance);
                entityObject[propName] = [];
                let jObject = {};
                entityObject[propName].push(jObject)
                this.createValidatorFormGroup(prop[0],jObject,propModelInstance.constructor);
                }

            }else if (typeof prop == "object"){
                if(prop instanceof FormGroup){
                  entityObject[propName] = prop;
                  defaultContainer.initPropertyObject(propName,OBJECT_PROPERTY,(prop instanceof FormArray) ? prop.controls[0].model : prop.model,modelInstance);
                }else if (prop instanceof FormArray){
                  entityObject[propName] = prop;
                  defaultContainer.initPropertyObject(propName,ARRAY_PROPERTY,(prop instanceof FormArray) ? prop.controls[0].model : prop.model,modelInstance);
                }else{
                this.formGroupPropOtherValidator[propName] = {};
                this.currentFormGroupPropOtherValidator = this.formGroupPropOtherValidator[propName];
                let propModelInstance = super.createInstance();
                entityObject[propName] = {};
                entityObject[propName].constructor= propModelInstance.constructor;
                defaultContainer.initPropertyObject(propName,OBJECT_PROPERTY,entityObject[propName].constructor,modelInstance);
                this.createValidatorFormGroup(groupObject[propName],entityObject[propName],entityObject[propName].constructor);
                }
            } 
          if(prop && prop.length > 0 && typeof prop[0] != "object" && !(prop instanceof FormArray))
            entityObject[propName] = prop[0]
          }
        
   }

    formGroup<T>(model: Type<T> | { [key: string]: any }, entityObject?: { [key: string]: any } | FormBuilderConfiguration, formBuilderConfiguration?: FormBuilderConfiguration): FormGroup {
        let json = this.getObject(model, entityObject, formBuilderConfiguration);
        model = json.model;
        entityObject = json.entityObject;
        formBuilderConfiguration = json.formBuilderConfiguration;
        if (formBuilderConfiguration)
            this.extractExpressions(formBuilderConfiguration);
        let instanceContainer: InstanceContainer = this.getInstanceContainer(model);
        this.checkObjectPropAdditionalValidation(instanceContainer, entityObject);
        let formGroupObject = {};
        let formChildGroup = undefined;
        let formArrayGroup = undefined;
        var additionalValidations: { [key: string]: PropValidationConfig } = {};
        instanceContainer.properties.forEach(property => {
            let isIncludeProp = true;
            if (formBuilderConfiguration && formBuilderConfiguration.excludeProps && formBuilderConfiguration.excludeProps.length > 0)
                isIncludeProp = formBuilderConfiguration.excludeProps.indexOf(property.name) == -1
            if (formBuilderConfiguration && formBuilderConfiguration.validations)
                additionalValidations = formBuilderConfiguration.validations;
            if (isIncludeProp) {
                switch (property.propertyType) {
                    case PROPERTY:
                        var propertyValidators = instanceContainer.propertyAnnotations.filter(t => t.propertyName == property.name);
                        formGroupObject[property.name] = [entityObject[property.name], this.addFormControl(property, propertyValidators, additionalValidations[property.name], instanceContainer)];
                        this.isNested = false;
                        break;
                    case OBJECT_PROPERTY:
                        if (entityObject[property.name] && entityObject[property.name] instanceof Object && !(entityObject[property.name] instanceof FormGroup)) {
                            this.isNested = true;
                            if (instanceContainer && instanceContainer.conditionalObjectProps)
                                this.conditionalObjectProps = instanceContainer.conditionalObjectProps.filter(t => t.objectPropName == property.name)
                            if (this.conditionalValidationInstance && this.conditionalValidationInstance.conditionalObjectProps)
                                this.builderConfigurationConditionalObjectProps = this.conditionalValidationInstance.conditionalObjectProps.filter(t => t.objectPropName == property.name);
                            if(this.formGroupPropOtherValidator[property.name])
                              this.currentFormGroupPropOtherValidator = this.formGroupPropOtherValidator[property.name];
                            formGroupObject[property.name] = this.formGroup(property.entity, entityObject[property.name], formBuilderConfiguration);
                            this.conditionalObjectProps = [];
                            this.builderConfigurationConditionalObjectProps = [];
                            this.isNested = false;
                        } else if (entityObject[property.name] instanceof FormGroup)
                          formGroupObject[property.name] = entityObject[property.name];
                        break;
                    case ARRAY_PROPERTY:
                        if (entityObject[property.name] && entityObject[property.name] instanceof Array && !(entityObject[property.name] instanceof FormArray)) {
                            this.isNested = true;
                            var formArrayGroup = [];
                            let index = 0;
                            for (let subObject of entityObject[property.name]) {
                                if (instanceContainer && instanceContainer.conditionalObjectProps)
                                    this.conditionalObjectProps = instanceContainer.conditionalObjectProps.filter(t => t.objectPropName == property.name && t.arrayIndex == index)
                                if (this.conditionalValidationInstance && this.conditionalValidationInstance.conditionalObjectProps)
                                    this.builderConfigurationConditionalObjectProps = this.conditionalValidationInstance.conditionalObjectProps.filter(t => t.objectPropName == property.name && t.arrayIndex == index);
                                  if(this.formGroupPropOtherValidator[property.name])
                                    this.currentFormGroupPropOtherValidator = this.formGroupPropOtherValidator[property.name];
                                formArrayGroup.push(this.formGroup(property.entity, subObject, formBuilderConfiguration));
                                index++;
                                this.conditionalObjectProps = [];
                                this.builderConfigurationConditionalObjectProps = [];
                            }
                            let formBuilder = new BuilderForm();
                            formBuilder.init(entityObject,formGroupObject);
                            formGroupObject[property.name] = formBuilder.array(formArrayGroup);
                            this.isNested = false;
                        }else if (entityObject[property.name] instanceof FormArray)
                            formGroupObject[property.name] = entityObject[property.name];
                        break;
                }
            }

        })
        if (!this.isNested) {
            this.conditionalValidationInstance = {};
            this.builderConfigurationConditionalObjectProps = [];
        }
        let formBuilder  = new BuilderForm();
        formBuilder.init(entityObject,formGroupObject)
        let formGroup = formBuilder.group(formGroupObject,undefined);
        formGroup.model = json.model;
        return formGroup;
    }
}
