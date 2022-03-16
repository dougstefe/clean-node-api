import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const sut = new LogControllerDecorator(controllerStub)
  return {
    sut,
    controllerStub
  }
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse = {
        statusCode: 200,
        body: {
          name: 'any_name'
        }
      }
      return await new Promise(resolve => resolve(httpResponse))
    }
  }
  return new ControllerStub()
}

describe('LogControllerDecorator', () => {
  test('Should call handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequestMock = {
      body: {
        name: 'any_name'
      }
    }
    await sut.handle(httpRequestMock)
    expect(handleSpy).toHaveBeenCalledWith(httpRequestMock)
  })

  test('Should return HttpResponse', async () => {
    const { sut } = makeSut()
    const httpRequestMock = {
      body: {
        name: 'any_name'
      }
    }
    const httpResponse = await sut.handle(httpRequestMock)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'any_name'
      }
    })
  })
})
