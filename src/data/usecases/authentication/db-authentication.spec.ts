import { AccountModel } from '../../../domain/models'
import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../interfaces/criptography/hash-comparer'
import { TokenGenerator } from '../../interfaces/criptography/token-generator'
import { FindAccountByEmailRepository } from '../../interfaces/db/find-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../interfaces/db/update-access-token-repository'
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
    async compare (_value: string, _hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new HashComparerStub()
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (_id: string): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }
  return new TokenGeneratorStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (_id: string, _token: string): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new UpdateAccessTokenRepositoryStub()
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
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const findAccountByEmailRepositoryStub = makeFindAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const sut = new DbAuthentication(findAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub, updateAccessTokenRepositoryStub)
  return {
    sut,
    findAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication', () => {
  test('Should call FindAccountByEmailRepository with correct email', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(findAccountByEmailRepositoryStub, 'findByEmail')
    await sut.auth(makeFakeAuthentication())
    expect(findSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if FindAccountByEmailRepository throw', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(findAccountByEmailRepositoryStub, 'findByEmail').mockImplementation(async () => await Promise.reject(new Error('any_error')))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow('any_error')
  })

  test('Should return null if FindAccountByEmailRepository not found account', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(findAccountByEmailRepositoryStub, 'findByEmail').mockImplementation(null)
    const response = await sut.auth(makeFakeAuthentication())
    expect(response).toBeNull()
  })

  test('Should call HashComparer with correct password', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throw if HashComparer throw', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockImplementation(async () => await Promise.reject(new Error('any_error')))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow('any_error')
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockImplementation(async () => await Promise.resolve(false))
    const response = await sut.auth(makeFakeAuthentication())
    expect(response).toBeNull()
  })

  test('Should call TokenGenerator with correct account id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthentication())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockImplementation(async () => await Promise.reject(new Error('any_error')))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow('any_error')
  })

  test('Should return accessToken', async () => {
    const { sut } = makeSut()
    const response = await sut.auth(makeFakeAuthentication())
    expect(response).toBe('any_token')
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    await sut.auth(makeFakeAuthentication())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })
})
