import { InvalidFieldError, RequiredFieldError } from '../../errors'
import { Validation } from '../../protocols/validation'
import { ValidationComposite } from './validation-composite'

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (_input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [
    makeValidationStub(),
    makeValidationStub()
  ]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('ValidationComposite', () => {
  test('Should returns an error if validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new RequiredFieldError('field'))

    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new RequiredFieldError('field'))
  })

  test('Should returns the first error if one or more validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new RequiredFieldError('field'))
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new InvalidFieldError('field'))

    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new RequiredFieldError('field'))
  })

  test('Should not returns if validation succeeds', () => {
    const { sut } = makeSut()

    const error = sut.validate({ field: 'any_value' })

    expect(error).toBeFalsy()
  })
})
