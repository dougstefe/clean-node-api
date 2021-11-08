export class InvalidFieldError extends Error {
  constructor (fieldName: string) {
    super(`Field '${fieldName}' is invalid.`)
    this.name = 'InvalidFieldError'
  }
}
