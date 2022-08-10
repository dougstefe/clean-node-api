import { AddAccount } from '../../../domain/usecases/add-account'
import { ServerError } from '../../errors'
import { badRequest, created, internalServerError } from '../../helpers/http/http-helper'
import { Validation } from '../../protocols/validation'
import { HttpRequest, HttpResponse, Controller } from '../../protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body

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
