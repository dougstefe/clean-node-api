import { AccountModel } from '../../../domain/models'
import { FindAccountByEmailRepository } from '../../interfaces/find-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

describe('', () => {
  test('Should call FindAccountByEmailRepository with correct email', async () => {
    class FindAccountByEmailRepositoryStub implements FindAccountByEmailRepository {
      async findByEmail (_email: string): Promise<AccountModel> {
        return await Promise.resolve({
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password'
        })
      }
    }
    const findAccountByEmailRepository = new FindAccountByEmailRepositoryStub()
    const sut = new DbAuthentication(findAccountByEmailRepository)
    const findSpy = jest.spyOn(findAccountByEmailRepository, 'findByEmail')
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(findSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
