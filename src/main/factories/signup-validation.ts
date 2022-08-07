import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export const makeSignupValidation = (): ValidationComposite => {
  return new ValidationComposite([])
}
