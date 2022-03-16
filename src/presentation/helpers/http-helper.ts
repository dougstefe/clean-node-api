import { ServerError } from '../errors'
import { HttpResponse } from '../protocols/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})
export const internalServerError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error)
})
export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
})
