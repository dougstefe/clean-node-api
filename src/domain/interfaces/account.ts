import { AccountModel } from '../models'

export interface AddAccountModel {
  name: string
  email: string
  password: string
}

export interface Account {
  add (account: AddAccountModel): Promise<AccountModel>
}
