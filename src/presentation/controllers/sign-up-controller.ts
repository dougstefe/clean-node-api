import { AccountService } from '../../domain/interfaces/account-service'
import { InvalidFieldError, RequiredFieldError, ServerError } from '../errors'
import { badRequest, internalServerError } from '../helpers/http-helper'
import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../protocols'

export default class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly accountService: AccountService

  constructor (emailValidator: EmailValidator, accountService: AccountService) {
    this.emailValidator = emailValidator
    this.accountService = accountService
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new RequiredFieldError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidFieldError('email'))
      }
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidFieldError('passwordConfirmation'))
      }
      this.accountService.add({
        name,
        email,
        password
      })
      return {
        statusCode: 204,
        body: {}
      }
    } catch (error) {
      return internalServerError(new ServerError())
    }
  }
}
