import { HttpResponse } from './http-response'

export interface HttpPostClient<R = any> {
  post: (params: HttpPostParams) => Promise<HttpResponse<R>>
}

export type HttpPostParams = {
  url: string
  body?: any
}
