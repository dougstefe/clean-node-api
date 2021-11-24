import { Encrypter } from '../interfaces/encrypter'
import { AccountRepository } from './account-repository'

describe('AccountRepository', () => {
  interface SubTypes {
    sut: AccountRepository
    encrypterStub: Encrypter
  }
  const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
      async encrypt (value: string): Promise<string> {
        return await new Promise(resolve => resolve('encrypted_password'))
      }
    }
    return new EncrypterStub()
  }
  const makeSut = (): SubTypes => {
    const encrypterStub = makeEncrypter()
    const sut = new AccountRepository(encrypterStub)
    return {
      sut,
      encrypterStub
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
})
