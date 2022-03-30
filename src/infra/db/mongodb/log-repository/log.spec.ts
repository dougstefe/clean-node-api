import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'

describe('Log Mongo Repository', () => {
  let collection: Collection
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    collection = MongoHelper.client.db().collection('errors')
    await collection.deleteMany({})
  })

  test('Should create an error log', async () => {
    const sut = new LogMongoRepository()
    await sut.logError(new Error('any_error'))
    const count = await collection.countDocuments()
    expect(count).toBe(1)
  })
})
