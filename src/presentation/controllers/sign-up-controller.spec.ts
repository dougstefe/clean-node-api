import { FieldRequiredError } from '../errors/missing-param-error'
import SignUpController from './sign-up-controller'

describe('SignUpController', () => {
  test('Should return 400 if no name', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new FieldRequiredError('name'))
  })
  test('Should return 400 if no email', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new FieldRequiredError('email'))
  })
  test('Should return 400 if no password', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@email.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new FieldRequiredError('password'))
  })
})
