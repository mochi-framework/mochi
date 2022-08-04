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

export type Endpoint = (req: MochiRequest, res: MochiResponse) => Promise<Response> | Response

export type Middleware = (req: MochiRequest, res: MochiResponse) => Promise<Response | void> | Response | void

export type Method = 'get' | 'post' | 'put' | 'delete' | 'all'
export interface Route {
  get?: {
    handler?: Endpoint
    middlewares?: Middleware[]
  }
  post?: {
    handler?: Endpoint
    middlewares?: Middleware[]
  }
  put?: {
    handler?: Endpoint
    middlewares?: Middleware[]
  }
  delete?: {
    handler?: Endpoint
    middlewares?: Middleware[]
  }
  all?: {
    handler?: Endpoint
    middlewares?: Middleware[] // When using use
  }
  router?: Router
  children?: RouteMap
  paramName?: string
}

export type RouteMap = Map<string, Route>
