import request from 'supertest'
import app from '../config/app'

describe('CORS Middleware', () => {
  test('Should allow origin', async () => {
    app.get('/test-cors', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test-cors')
      .send()
      .expect('access-control-allow-origin', '*')
  })
  test('Should allow methods', async () => {
    app.get('/test-cors', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test-cors')
      .send()
      .expect('access-control-allow-methods', '*')
  })
  test('Should allow headers', async () => {
    app.get('/test-cors', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test-cors')
      .send()
      .expect('access-control-allow-headers', '*')
  })
})
