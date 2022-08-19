import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { AccountModel } from '../../../domain/models'
import { Hasher } from '../../interfaces/criptography/hasher'
import { AddAccountRepository } from '../../interfaces/db/add-account-repository'

export class DbAddAccount implements AddAccount {
  private readonly hasher: Hasher
  private readonly addAccountRepository: AddAccountRepository

  constructor (hasher: Hasher, addAccountRepository: AddAccountRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
  }

  async add (addAccountModel: AddAccountModel): Promise<AccountModel> {
    const encryptedPassword = await this.hasher.hash(addAccountModel.password)
    const accountModel = await this.addAccountRepository.add(Object.assign({}, addAccountModel, { password: encryptedPassword }))
    return accountModel
  }
}
