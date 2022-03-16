import { AddAccountModel, AddAccount } from '../../domain/usecases/add-account'
import { AccountModel } from '../../domain/models'
import { InvalidFieldError, RequiredFieldError, ServerError } from '../errors'
import { EmailValidator, HttpRequest } from '../protocols'
import { SignUpController } from './sign-up-controller'
import { badRequest, created, internalServerError } from '../helpers/http-helper'

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
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const accountServiceStub = makeAccountServiceAdd()
  const sut = new SignUpController(emailValidatorStub, accountServiceStub)
  return {
    sut,
    emailValidatorStub,
    accountServiceStub
  }
}

describe('SignUpController', () => {
  test('Should return 400 if no name', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new RequiredFieldError('name')))
  })
  test('Should return 400 if no email', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new RequiredFieldError('email')))
  })
  test('Should return 400 if no password', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new RequiredFieldError('password')))
  })
  test('Should return 400 if no passwordConfirmation', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new RequiredFieldError('passwordConfirmation')))
  })
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
  test('Should return 400 if password confirmation fail', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidFieldError('passwordConfirmation')))
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
})
