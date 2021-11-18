import EmailValidatorAdapter from './email-validator-adapter'

describe('EmailValidatorAdapter', () => {
  test('Should EmailValidatorAdapter returns false', async () => {
    const email = 'invalid_email@email.com'
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid(email)
    expect(isValid).toBe(false)
  })
})
