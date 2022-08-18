import { AccountModel } from '../../../domain/models'
import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../interfaces/criptography/hash-comparer'
import { FindAccountByEmailRepository } from '../../interfaces/db/find-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

const makeFindAccountByEmailRepository = (): FindAccountByEmailRepository => {
  class FindAccountByEmailRepositoryStub implements FindAccountByEmailRepository {
    async findByEmail (_email: string): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new FindAccountByEmailRepositoryStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new HashComparerStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

export interface SutTypes {
  sut: DbAuthentication
  findAccountByEmailRepositoryStub: FindAccountByEmailRepository
  hashComparerStub: HashComparer
}

const makeSut = (): SutTypes => {
  const findAccountByEmailRepositoryStub = makeFindAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const sut = new DbAuthentication(findAccountByEmailRepositoryStub, hashComparerStub)
  return {
    sut,
    findAccountByEmailRepositoryStub,
    hashComparerStub
  }
}

describe('DbAuthentication', () => {
  test('Should call FindAccountByEmailRepository with correct email', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(findAccountByEmailRepositoryStub, 'findByEmail')
    await sut.auth(makeFakeAuthentication())
    expect(findSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if findAccountByEmailRepositoryStub throw', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(findAccountByEmailRepositoryStub, 'findByEmail').mockImplementation(async () => await Promise.reject(new Error('any_error')))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow('any_error')
  })

  test('Should return null if findAccountByEmailRepositoryStub not found account', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(findAccountByEmailRepositoryStub, 'findByEmail').mockImplementation(async () => null)
    const response = await sut.auth(makeFakeAuthentication())
    expect(response).toBeNull()
  })

  test('Should call HashComparer with correct password', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })
})
