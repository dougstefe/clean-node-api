import { Account, AddAccountModel } from '../../domain/interfaces/account'
import { AccountModel } from '../../domain/models'
import { Encrypter } from '../interfaces/encrypter'

export class AccountRepository implements Account {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    const accountModel = { ...account, id: 'id_account' }
    return await new Promise(resolve => resolve(accountModel))
  }
}
