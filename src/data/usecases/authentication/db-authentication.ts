import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { FindAccountByEmailRepository } from '../../interfaces/db/find-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (private readonly findAccountByEmailRepository: FindAccountByEmailRepository) {}
  async auth (credentials: AuthenticationModel): Promise<string> {
    const { email } = credentials
    await this.findAccountByEmailRepository.findByEmail(email)
    return null
  }
}
