import { AccountModel } from '../../../domain/models'
import { AddAccountModel } from '../../../domain/usecases/add-account'
import { AddAccountRepository } from '../../interfaces/db/account/add-account-repository'
import { Hasher } from '../../interfaces/criptography/hasher'
import { DbAddAccount } from './db-add-account'

describe('AccountRepository', () => {
  const makeHasher = (): Hasher => {
    class HasherStub implements Hasher {
      async hash (value: string): Promise<string> {
        return await new Promise(resolve => resolve('hashed_password'))
      }
    }
    return new HasherStub()
  }

  const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
      async add (addAccountModel: AddAccountModel): Promise<AccountModel> {
        const fakeAccountModel = makeAccountModelMock()
        return await new Promise(resolve => resolve(fakeAccountModel))
      }
    }
    return new AddAccountRepositoryStub()
  }

  const makeAddAccountModelMock = (): AddAccountModel => ({
    name: 'valid_name',
    email: 'valid@email.com',
    password: 'valid_password'
  })

  const makeAccountModelMock = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid@email.com',
    password: 'hashed_password'
  })

  interface SubTypes {
    sut: DbAddAccount
    hasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
  }
  const makeSut = (): SubTypes => {
    const hasherStub = makeHasher()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)
    return {
      sut,
      hasherStub,
      addAccountRepositoryStub
    }
  }
  test('Should hash password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const addAccountModelMock = makeAddAccountModelMock()
    await sut.add(addAccountModelMock)
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })
  test('Should throw if hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const addAccountModelMock = makeAddAccountModelMock()
    const promise = sut.add(addAccountModelMock)
    await expect(promise).rejects.toThrow()
  })
  test('Should add account repository', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const addAccountModelMock = makeAddAccountModelMock()
    await sut.add(addAccountModelMock)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid@email.com',
      password: 'hashed_password'
    })
  })
  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const addAccountModelMock = makeAddAccountModelMock()
    const promise = sut.add(addAccountModelMock)
    await expect(promise).rejects.toThrow()
  })
  test('Should return account', async () => {
    const { sut } = makeSut()
    const addAccountModelMock = makeAddAccountModelMock()
    const result = await sut.add(addAccountModelMock)
    expect(result).toEqual(makeAccountModelMock())
  })
})
