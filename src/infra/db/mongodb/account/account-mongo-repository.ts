import { ObjectId } from 'mongodb'
import { AddAccountRepository } from '../../../../data/interfaces/db/account/add-account-repository'
import { FindAccountByEmailRepository } from '../../../../data/interfaces/db/account/find-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../../../data/interfaces/db/account/update-access-token-repository'
import { AccountModel } from '../../../../domain/models'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, FindAccountByEmailRepository, UpdateAccessTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    return MongoHelper.mapInsertResult(await accountCollection.insertOne(accountData), accountData)
  }

  async findByEmail (email: string): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({ email })
    return result && MongoHelper.mapFindOne(result)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: { accessToken: token } })
  }
}
