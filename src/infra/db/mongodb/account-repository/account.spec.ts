import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    const accountCollection = MongoHelper.client.db().collection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => new AccountMongoRepository()

  test('Should return an account on success', async () => {
    const sut = makeSut()
    const response = await sut.add({
      name: 'any name',
      email: 'any@email.com',
      password: 'any_password'
    })
    expect(response).toBeTruthy()
    expect(response.id).toBeTruthy()
    expect(response.name).toBe('any name')
    expect(response.email).toBe('any@email.com')
    expect(response.password).toBe('any_password')
  })
})
