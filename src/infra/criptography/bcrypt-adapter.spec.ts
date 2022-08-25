import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (_data: string, _saltOrRounds: number): Promise<string> {
    return await new Promise(resolve => resolve('hashed'))
  },
  async compare (_value: string, _hash: string): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('BCrypt Adapter', () => {
  test('Should call hash with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return hashed', async () => {
    const sut = makeSut()
    const result = await sut.hash('any_value')
    expect(result).toEqual('hashed')
  })

  test('Should throw if hash throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => await Promise.reject(new Error()))
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })

  test('Should call compare with correct values', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  test('Should return true if compare success', async () => {
    const sut = makeSut()
    const result = await sut.compare('any_value', 'any_hash')
    expect(result).toEqual(true)
  })

  test('Should return false if compare fails', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => await Promise.resolve(false))
    const result = await sut.compare('any_value', 'any_hash')
    expect(result).toEqual(false)
  })

  test('Should throw if compare throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => await Promise.reject(new Error()))
    const promise = sut.compare('any_value', 'hash_value')
    await expect(promise).rejects.toThrow()
  })
})
