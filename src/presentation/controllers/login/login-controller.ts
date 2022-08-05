import { RequiredFieldError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) { return await Promise.resolve(badRequest(new RequiredFieldError('email'))) }
    if (!httpRequest.body.password) { return await Promise.resolve(badRequest(new RequiredFieldError('password'))) }
  }
}
