import { EmailValidator } from '../protocols'
import validator from 'validator'

export default class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    return validator.isEmail(email)
  }
}
