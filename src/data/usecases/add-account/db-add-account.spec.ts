import { AccountModel } from '../../../domain/models'
import { AddAccountModel } from '../../../domain/usecases/add-account'
import { AddAccountRepository } from '../../interfaces/db/add-account-repository'
import { Encrypter } from '../../interfaces/criptography/encrypter'
import { DbAddAccount } from './db-add-account'

describe('AccountRepository', () => {
  const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
      async encrypt (value: string): Promise<string> {
        return await new Promise(resolve => resolve('encrypted_password'))
      }
    }
    return new EncrypterStub()
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
    password: 'encrypted_password'
  })

  interface SubTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
    addAccountRepositoryStub: AddAccountRepository
  }
  const makeSut = (): SubTypes => {
    const encrypterStub = makeEncrypter()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
    return {
      sut,
      encrypterStub,
      addAccountRepositoryStub
    }
  }
  test('Should encrypt password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const addAccountModelMock = makeAddAccountModelMock()
    await sut.add(addAccountModelMock)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
  test('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
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
      password: 'encrypted_password'
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
