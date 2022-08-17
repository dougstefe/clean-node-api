import { AccountModel } from '../../domain/models'

export interface FindAccountByEmailRepository {
  findByEmail(email: string): Promise<AccountModel>
}
