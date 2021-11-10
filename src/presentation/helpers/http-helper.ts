import { HttpResponse } from '../protocols/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})
export const InternalServerError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: error
})
