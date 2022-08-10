import { MochiRequest } from './MochiRequest'
import { MochiResponse } from './MochiResponse'
import { Router } from './Router'

export type Params = { [key: string]: string }
export type QueryParams = { [key: string]: string }
export type Body = { [key: string]: any }
export interface Config {
  port?: number
  host?: string
}

export enum HandlerType {
  MIDDLEWARE,
  ENDPOINT,
  ROUTER,
}

export type Method = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'all'


type ParametricURL<Path extends string> = Path extends `/${infer First}/${string}`
  ? (First extends `:${infer Param}` ? { [key in Param]: string } : unknown) &
      ParametricURL<Path extends `/${string}/${infer Second}` ? `/${Second}` : ''>
  : Path extends `/${infer Final}`
  ? Final extends `:${infer Param}`
    ? { [key in Param]: string } & ParametricURL<Param>
    : unknown
  : unknown



type Handler<Params, Returns> = (req: MochiRequest & {params: Params}, res: MochiResponse) => Returns

export type Endpoint<Params = {}> = Handler<Params, Promise<Response> | Response>
export type Middleware<Params = {}> = Handler<Params, Promise<Response | void> | Response | void>

export type MethodHandler = <Path extends string, Params = ParametricURL<Path>>(path: Path, ...cb: [...Middleware<Params>[], Endpoint<Params>]) => void


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
