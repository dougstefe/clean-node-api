import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { AccountModel } from '../../../domain/models'
import { Encrypter } from '../../interfaces/encrypter'
import { AddAccountRepository } from '../../interfaces/add-account-repository'

export class AccountRepository implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (addAccountModel: AddAccountModel): Promise<AccountModel> {
    const encryptedPassword = await this.encrypter.encrypt(addAccountModel.password)
    const accountModel = await this.addAccountRepository.add(Object.assign({}, addAccountModel, { password: encryptedPassword }))
    return accountModel
  }
}
