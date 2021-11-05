export default class SignUpController {
  handle (httpRequest: any): any {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new Error('Field \'name\' is required.')
      }
    }
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new Error('Field \'email\' is required.')
      }
    }
    return {
      statusCode: 200,
      body: {}
    }
  }
}
