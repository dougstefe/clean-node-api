import { AddAccountRepository } from '../../../../../data/interfaces/add-account-repository'
import { AccountModel } from '../../../../../domain/models'
import { AddAccountModel } from '../../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const response = await accountCollection.insertOne(accountData)
    console.log(response)
    return Object.assign({}, accountData, { id: response.insertedId.toString() })
  }
}
