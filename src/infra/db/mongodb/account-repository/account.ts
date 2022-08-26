import { AddAccountRepository } from '../../../../data/interfaces/db/add-account-repository'
import { FindAccountByEmailRepository } from '../../../../data/interfaces/db/find-account-by-email-repository'
import { AccountModel } from '../../../../domain/models'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, FindAccountByEmailRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    return MongoHelper.mapInsertResult(await accountCollection.insertOne(accountData), accountData)
  }

  async findByEmail (email: string): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({ email })
    return result && MongoHelper.mapFindOne(result)
  }
}
