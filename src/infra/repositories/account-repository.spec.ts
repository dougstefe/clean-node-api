import { Encrypter } from '../interfaces/encrypter'
import { AccountRepository } from './account-repository'

describe('AccountRepository', () => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('encrypted_password'))
    }
  }
  test('Should encrypt password', async () => {
    const encrypterStub = new EncrypterStub()
    const sut = new AccountRepository(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const addAccountModelMock = {
      name: 'valid_name',
      email: 'valid@email.com',
      password: 'valid_password'
    }
    await sut.add(addAccountModelMock)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
