import { AccountModel } from '../../../domain/models'
import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { FindAccountByEmailRepository } from '../../interfaces/find-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

const makeFindAccountByEmailRepository = (): FindAccountByEmailRepository => {
  class FindAccountByEmailRepositoryStub implements FindAccountByEmailRepository {
    async findByEmail (_email: string): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new FindAccountByEmailRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

export interface SutTypes {
  sut: DbAuthentication
  findAccountByEmailRepository: FindAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const findAccountByEmailRepository = makeFindAccountByEmailRepository()
  const sut = new DbAuthentication(findAccountByEmailRepository)
  return {
    sut,
    findAccountByEmailRepository
  }
}

describe('DbAuthentication', () => {
  test('Should call FindAccountByEmailRepository with correct email', async () => {
    const { sut, findAccountByEmailRepository } = makeSut()
    const findSpy = jest.spyOn(findAccountByEmailRepository, 'findByEmail')
    await sut.auth(makeFakeAuthentication())
    expect(findSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if FindAccountByEmailRepository throw', async () => {
    const { sut, findAccountByEmailRepository } = makeSut()
    jest.spyOn(findAccountByEmailRepository, 'findByEmail').mockImplementation(async () => await Promise.reject(new Error('any_error')))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow('any_error')
  })
})
