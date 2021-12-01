import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (data: string, salt: number): Promise<string> {
    return await new Promise(resolve => resolve('hashed'))
  }
}))

const salt = 12
const makeSut = (): BCryptAdapter => {
  return new BCryptAdapter(salt)
}

describe('BCrypt Adapter', () => {
  test('Should call bcrypt', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
  test('Should returns hashed', async () => {
    const sut = makeSut()
    const result = await sut.encrypt('any_value')
    expect(result).toEqual('hashed')
  })
})
