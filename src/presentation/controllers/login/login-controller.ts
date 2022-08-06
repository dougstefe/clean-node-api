import { InvalidFieldError, RequiredFieldError } from '../../errors'
import { badRequest, internalServerError } from '../../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) { }
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return await Promise.resolve(badRequest(new RequiredFieldError('email')))
      }
      if (!password) {
        return await Promise.resolve(badRequest(new RequiredFieldError('password')))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return await Promise.resolve(badRequest(new InvalidFieldError('email')))
      }
    } catch (error) {
      return internalServerError(error)
    }
  }
}
