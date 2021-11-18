import EmailValidatorAdapter from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidatorAdapter', () => {
  test('Should returns false', async () => {
    const email = 'invalid_email@email.com'
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid(email)
    expect(isValid).toBe(false)
  })
  test('Should returns true', async () => {
    const email = 'valid_email@email.com'
    const sut = makeSut()
    const isValid = sut.isValid(email)
    expect(isValid).toBe(true)
  })
  test('Should call validator with email', async () => {
    const email = 'valid_email@email.com'
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    const sut = makeSut()
    sut.isValid(email)
    expect(isEmailSpy).toHaveBeenCalledWith(email)
  })
})
