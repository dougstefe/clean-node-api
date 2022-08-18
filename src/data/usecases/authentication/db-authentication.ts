import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../interfaces/criptography/hash-comparer'
import { FindAccountByEmailRepository } from '../../interfaces/db/find-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository,
    private readonly hashComparer: HashComparer
  ) {}

  async auth (credentials: AuthenticationModel): Promise<string> {
    const { email, password } = credentials
    const account = await this.findAccountByEmailRepository.findByEmail(email)
    if (account) {
      await this.hashComparer.compare(password, account.password)
    }
    return null
  }
}
