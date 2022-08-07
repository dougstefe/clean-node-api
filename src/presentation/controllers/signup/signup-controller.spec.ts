import { AddAccountModel, AddAccount } from '../../../domain/usecases/add-account'
import { AccountModel } from '../../../domain/models'
import { InvalidFieldError, RequiredFieldError, ServerError } from '../../errors'
import { EmailValidator, HttpRequest } from '../../protocols'
import { SignUpController } from './signup-controller'
import { badRequest, created, internalServerError } from '../../helpers/http-helper'
import { Validation } from '../../helpers/validators/validation'

const makeRequestMock = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeAccountModelMock = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password'
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (_input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAccountServiceAdd = (): AddAccount => {
  class AccountServiceStub implements AddAccount {
    async add (addAccountModel: AddAccountModel): Promise<AccountModel> {
      const accountModelMock = makeAccountModelMock()
      return await new Promise(resolve => resolve(accountModelMock))
    }
  }
  return new AccountServiceStub()
}
interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  accountServiceStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const accountServiceStub = makeAccountServiceAdd()
  const validationStub = makeValidation()
  const sut = new SignUpController(emailValidatorStub, accountServiceStub, validationStub)
  return {
    sut,
    emailValidatorStub,
    accountServiceStub,
    validationStub
  }
}

describe('SignUpController', () => {
  test('Should return 400 if invalid email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = makeRequestMock()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidFieldError('email')))
  })
  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeRequestMock()
    await sut.handle(httpRequest)
    expect(isValidSpy).toBeCalledWith('any_email@email.com')
  })
  test('Should return 500 EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new ServerError(new Error())
    })
    const httpRequest = makeRequestMock()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(internalServerError(new Error('')))
  })
  test('Should return 500 AccountService.Add throws', async () => {
    const { sut, accountServiceStub } = makeSut()
    jest.spyOn(accountServiceStub, 'add').mockImplementationOnce(() => {
      throw new ServerError(new Error())
    })
    const httpRequest = makeRequestMock()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(internalServerError(new Error('')))
  })
  test('Should call AddAccount with correct values', async () => {
    const { sut, accountServiceStub } = makeSut()
    const addSpy = jest.spyOn(accountServiceStub, 'add')
    const httpRequest = makeRequestMock()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })
  test('Should return 201 when success', async () => {
    const { sut } = makeSut()
    const httpRequest = makeRequestMock()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(created(makeAccountModelMock()))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeRequestMock()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new RequiredFieldError('any_field'))
    const httpRequest = makeRequestMock()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new RequiredFieldError('any_field')))
  })
})
