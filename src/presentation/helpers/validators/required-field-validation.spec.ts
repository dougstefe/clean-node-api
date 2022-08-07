import { RequiredFieldError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredFieldValidation', () => {
  test('Should return a RequiredFieldError if validation fails', () => {
    const sut = new RequiredFieldValidation('any_field')

    const error = sut.validate({ name: 'any_name' })

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })
})
