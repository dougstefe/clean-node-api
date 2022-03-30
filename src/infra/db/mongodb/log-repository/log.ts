import { LogErrorRepository } from '../../../../data/interfaces/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class LogMongoRepository implements LogErrorRepository {
  async logError (error: Error): Promise<void> {
    const collection = await MongoHelper.getCollection('errors')
    await collection.insertOne({
      error,
      date: new Date()
    })
  }
}
