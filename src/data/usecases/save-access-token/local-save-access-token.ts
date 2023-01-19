import { SetStorage } from '@/data/protocols/cache'
import { SaveAccessTokenn } from '@/domain/usecases'

export class LocalSaveAccessToken implements SaveAccessTokenn {
  constructor (private readonly setStorage: SetStorage) {}
  async save (accessToken: string): Promise<void> {
    await this.setStorage.set('accessToken', accessToken)
  }
}
