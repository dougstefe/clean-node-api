import { InvalidFieldError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

describe('CompareFieldsValidation', () => {
  test('Should return a InvalidFieldError if validation fails', () => {
    const sut = new CompareFieldsValidation('field', 'fieldToCompare')

    const error = sut.validate({ field: 'any_value', fieldToCompare: 'other_value' })

    expect(error).toEqual(new InvalidFieldError('fieldToCompare'))
  })
})
