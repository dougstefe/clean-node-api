import { RequiredFieldError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    if (!email) { return await Promise.resolve(badRequest(new RequiredFieldError('email'))) }
    if (!password) { return await Promise.resolve(badRequest(new RequiredFieldError('password'))) }
    this.emailValidator.isValid(email)
  }
}
