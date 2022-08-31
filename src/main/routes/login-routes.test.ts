import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    accountCollection = MongoHelper.client.db().collection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 201 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Douglas',
          email: 'douglas@gmail.com',
          password: '123456',
          passwordConfirmation: '123456'
        })
        .expect(201)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('123456', 12)
      await accountCollection.insertOne({
        name: 'Douglas',
        email: 'douglas@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'douglas@gmail.com',
          password: '123456'
        })
        .expect(200)
    })
  })
})
