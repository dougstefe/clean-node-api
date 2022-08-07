import { InvalidFieldError } from '../../errors'
import { Validation } from './validation'

export class CompareFieldsValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly fieldNameToCompare: string) {}

  validate (input: any): Error {
    if (input[this.fieldName] !== input[this.fieldNameToCompare]) { return new InvalidFieldError(this.fieldNameToCompare) }
  }
}
