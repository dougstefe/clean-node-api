export class FieldRequiredError extends Error {
  constructor (fieldName: string) {
    super(`Field '${fieldName}' is required.`)
    this.name = 'FieldRequiredError'
  }
}
