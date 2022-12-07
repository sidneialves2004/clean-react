import { HttpResponse } from './http-response'

export interface HttpPostClient<T, R> {
  post: (params: HttpPostParams<T>) => Promise<HttpResponse<R>>
}

export type HttpPostParams<T> = {
  url: string
  body?: T
}
