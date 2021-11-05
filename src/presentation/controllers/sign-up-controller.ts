import { HttpRequest, HttpResponse } from '../protocols/http'
import { FieldRequiredError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'

export default class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new FieldRequiredError(field))
      }
    }
    return {
      statusCode: 204,
      body: {}
    }
  }
}
