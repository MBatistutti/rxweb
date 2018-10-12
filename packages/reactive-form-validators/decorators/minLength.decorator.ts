import { defaultContainer } from '../core/defaultContainer';
import { NumberConfig } from "../models/config/number-config";
import { AnnotationTypes } from "../core/validator.static";
export function minLength(config:NumberConfig) {
    return function (
        target: Object,
        propertyKey: string, parameterIndex?: any
    ) {
      defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.minLength, config)    
    }
}
