import { LogErrorRepository } from '../../data/interfaces/log-error-repository'
import { AccountModel } from '../../domain/models'
import { created, internalServerError } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse = created(makeAccountModelMock())
      return await new Promise(resolve => resolve(httpResponse))
    }
  }
  return new ControllerStub()
}

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (_: Error): Promise<void> {
      return await new Promise(resolve => resolve(null))
    }
  }
  return new LogErrorRepositoryStub()
}

const makeHttpRequestMock = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    name: 'any_name',
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

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const logErrorRepositoryStub = makeLogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogControllerDecorator', () => {
  test('Should call handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequestMock = makeHttpRequestMock()
    await sut.handle(httpRequestMock)
    expect(handleSpy).toHaveBeenCalledWith(httpRequestMock)
  })

  test('Should return HttpResponse', async () => {
    const { sut } = makeSut()
    const httpRequestMock = makeHttpRequestMock()
    const httpResponse = await sut.handle(httpRequestMock)
    expect(httpResponse).toEqual(created(makeAccountModelMock()))
  })

  test('Should log error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const internalServerErrorMock = internalServerError(new Error('teste'))
    jest.spyOn(controllerStub, 'handle').mockReturnValue(new Promise(resolve => resolve(internalServerErrorMock)))
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    const httpRequestMock = makeHttpRequestMock()
    await sut.handle(httpRequestMock)
    expect(logSpy).toBeCalledWith(internalServerErrorMock.body)
  })
})
