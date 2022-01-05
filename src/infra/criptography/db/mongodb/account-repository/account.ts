import { AddAccountRepository } from '../../../../../data/interfaces/add-account-repository'
import { AccountModel } from '../../../../../domain/models'
import { AddAccountModel } from '../../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    return MongoHelper.mapResult(await accountCollection.insertOne(accountData), accountData)
  }
}
