import { AddAccount } from '../../../domain/usecases/add-account'
import { InvalidFieldError, RequiredFieldError, ServerError } from '../../errors'
import { badRequest, created, internalServerError } from '../../helpers/http-helper'
import { Validation } from '../../helpers/validators/validation'
import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../../protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validation.validate(httpRequest.body)
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
      const accountModel = await this.addAccount.add({
        name,
        email,
        password
      })
      return created(accountModel)
    } catch (error) {
      console.error(error)
      return internalServerError(new ServerError(error))
    }
  }
}
