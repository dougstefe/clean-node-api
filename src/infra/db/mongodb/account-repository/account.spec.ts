import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'
let accountCollection
describe('Account Mongo Repository', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    accountCollection = MongoHelper.client.db().collection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => new AccountMongoRepository()

  test('Should return an account on add success', async () => {
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

  test('Should return an account on findByEmail success', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: 'any name',
      email: 'any@email.com',
      password: 'any_password'
    })
    const response = await sut.findByEmail('any@email.com')
    expect(response).toBeTruthy()
    expect(response.id).toBeTruthy()
    expect(response.name).toBe('any name')
    expect(response.email).toBe('any@email.com')
    expect(response.password).toBe('any_password')
  })

  test('Should return null if findByEmail fails', async () => {
    const sut = makeSut()
    const response = await sut.findByEmail('any@email.com')
    expect(response).toBeFalsy()
  })

  test('Should update the account accessToken when updateAccessToken success', async () => {
    const sut = makeSut()
    const result = await accountCollection.insertOne({
      name: 'any name',
      email: 'any@email.com',
      password: 'any_password'
    })
    console.log(result)
    const accountId = result.insertedId
    await sut.updateAccessToken(String(accountId), 'any_token')
    const account = await accountCollection.findOne({
      _id: accountId
    })
    expect(account).toBeTruthy()
    expect(account.accessToken).toBe('any_token')
  })
})
