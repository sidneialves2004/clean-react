import { HttpResponse } from './http-response'

export interface HttpPostClient {
  post: (params: HttpPostParams) => Promise<HttpResponse>
}

export type HttpPostParams = {
  url: string
  body?: object
}
