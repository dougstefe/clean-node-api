import { AccountModel } from '../../domain/models'
import { AddAccountModel } from '../../domain/usecases/account'

export interface AddAccountRepository {
  add (addAccountModel: AddAccountModel): Promise<AccountModel>
}
