import { MochiRequest } from './MochiRequest'
import { MochiResponse } from './MochiResponse'
import { Router } from './Router'

export type Params = { [key: string]: string }
export type QueryParams = { [key: string]: string }
export type Body = { [key: string]: any }
export interface Config {
  host: string
  port: number
  globals: {
    [key: string]: any
  }
}

export enum HandlerType {
  MIDDLEWARE,
  ENDPOINT,
  ROUTER,
}

export type Method = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'all'

export type Endpoint = (req: MochiRequest, res: MochiResponse) => Promise<Response> | Response
export type Middleware = (req: MochiRequest, res: MochiResponse) => Promise<Response | void> | Response | void
export type Route = Partial<
  Record<
    Method,
    {
      endpoint?: Endpoint
      middlewares?: Middleware[]
    }
  >
> & {
  children: RouteMap
  router?: Router
  paramName?: string
}

export type RouteMap = Map<string, Route>
