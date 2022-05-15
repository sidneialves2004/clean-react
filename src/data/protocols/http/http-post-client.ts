export interface HttpPostClient {
  post: (params: HttpPostParams) => Promise<void>
}

export type HttpPostParams = {
  url: string
  body?: object
}