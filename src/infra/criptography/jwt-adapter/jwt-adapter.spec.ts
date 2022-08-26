import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await Promise.resolve('any_token')
  }
}))

const makeSut = (): JwtAdapter => new JwtAdapter('any_secret')

describe('JwtAdapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'any_secret')
  })

  test('Should return a token if sign success', async () => {
    const sut = makeSut()
    const response = await sut.encrypt('any_id')
    expect(response).toEqual('any_token')
  })

  test('Should throw if sign throws', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(async () => await Promise.reject(new Error()))
    const promise = sut.encrypt('any_id')
    await expect(promise).rejects.toThrow()
  })
})
