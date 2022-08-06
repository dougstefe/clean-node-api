import { Authentication } from '../../../domain/usecases/authentication'
import { InvalidFieldError, RequiredFieldError } from '../../errors'
import { badRequest, internalServerError } from '../../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator, private readonly authentication: Authentication) { }
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new RequiredFieldError(field))
        }
      }
      const { email, password } = httpRequest.body
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidFieldError('email'))
      }
      await this.authentication.auth(email, password)
    } catch (error) {
      return internalServerError(error)
    }
  }
}
