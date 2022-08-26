import { Collection, InsertOneResult, MongoClient, WithId } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  },
  async disconnect (): Promise<void> {
    this.client.close()
  },
  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },
  mapInsertResult (result: InsertOneResult, data: any): any {
    return Object.assign({}, data, { id: result.insertedId.toString() })
  },
  mapFindOne<T> (result: WithId<T>): any {
    const { _id: remove, ...newObject } = result
    return {
      ...newObject,
      id: remove
    }
  }
}
