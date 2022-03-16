import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

describe('LogControllerDecorator', () => {
  const makeControllerStub = (): Controller => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        return await new Promise(resolve => resolve(null))
      }
    }
    return new ControllerStub()
  }
  test('Should call handle', async () => {
    const controllerStub = makeControllerStub()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const sut = new LogControllerDecorator(controllerStub)
    const httpRequestMock = {
      body: {
        name: 'any_name'
      }
    }
    await sut.handle(httpRequestMock)
    expect(handleSpy).toHaveBeenCalledWith(httpRequestMock)
  })
})
