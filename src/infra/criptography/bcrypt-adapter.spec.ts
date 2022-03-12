import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (data: string, saltOrRounds: number): Promise<string> {
    return await new Promise(resolve => resolve('hashed'))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('BCrypt Adapter', () => {
  test('Should call bcrypt', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
  test('Should return hashed', async () => {
    const sut = makeSut()
    const result = await sut.encrypt('any_value')
    expect(result).toEqual('hashed')
  })
  // test('Should throw if bcrypt throws', async () => {
  //   const sut = makeSut()
  //   jest.spyOn(bcrypt, 'hash').mockImplementationOnce((): Promise<string> => Promise.reject(new Error()))
  //   const promise = sut.encrypt('any_value')
  //   await expect(promise).rejects.toThrow()
  // })
})
