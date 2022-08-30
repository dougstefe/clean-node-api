import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../interfaces/criptography/hash-comparer'
import { Encrypter } from '../../interfaces/criptography/encrypter'
import { FindAccountByEmailRepository } from '../../interfaces/db/account/find-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../interfaces/db/account/update-access-token-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (credentials: AuthenticationModel): Promise<string> {
    const { email, password } = credentials
    const account = await this.findAccountByEmailRepository.findByEmail(email)
    if (account) {
      const { id: accountId, password: accountPassword } = account
      const isValid = await this.hashComparer.compare(password, accountPassword)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(accountId)
        await this.updateAccessTokenRepository.updateAccessToken(accountId, accessToken)
        return accessToken
      }
    }
    return null
  }
}
