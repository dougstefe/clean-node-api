import { HttpRequest, HttpResponse } from '../protocols/http'
import { FieldRequiredError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'

export default class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new FieldRequiredError('name'))
    }
    if (!httpRequest.body.email) {
      return badRequest(new FieldRequiredError('email'))
    }
    return {
      statusCode: 204,
      body: {}
    }
  }
}
