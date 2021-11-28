import { AccountModel } from '../../../domain/models'
import { AddAccountModel } from '../../../domain/usecases/add-account'
import { AddAccountRepository } from '../../interfaces/add-account-repository'
import { Encrypter } from '../../interfaces/encrypter'
import { AccountRepository } from './db-add-account'

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
        const fakeAccountModel = {
          id: 'valid_id',
          name: 'valid_name',
          email: 'valid@email.com',
          password: 'encrypted_password'
        }
        return await new Promise(resolve => resolve(fakeAccountModel))
      }
    }
    return new AddAccountRepositoryStub()
  }
  interface SubTypes {
    sut: AccountRepository
    encrypterStub: Encrypter
    addAccountRepositoryStub: AddAccountRepository
  }
  const makeSut = (): SubTypes => {
    const encrypterStub = makeEncrypter()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new AccountRepository(encrypterStub, addAccountRepositoryStub)
    return {
      sut,
      encrypterStub,
      addAccountRepositoryStub
    }
  }
  test('Should encrypt password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const addAccountModelMock = {
      name: 'valid_name',
      email: 'valid@email.com',
      password: 'valid_password'
    }
    await sut.add(addAccountModelMock)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
  test('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const addAccountModelMock = {
      name: 'valid_name',
      email: 'valid@email.com',
      password: 'valid_password'
    }
    const promise = sut.add(addAccountModelMock)
    await expect(promise).rejects.toThrow()
  })
  test('Should add account repository', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const addAccountModelMock = {
      name: 'valid_name',
      email: 'valid@email.com',
      password: 'valid_password'
    }
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
    const addAccountModelMock = {
      name: 'valid_name',
      email: 'valid@email.com',
      password: 'valid_password'
    }
    const promise = sut.add(addAccountModelMock)
    await expect(promise).rejects.toThrow()
  })
})
