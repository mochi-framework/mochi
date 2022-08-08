import { Endpoint, Method, Middleware, RouteMap, Route, HandlerType } from './types'

export class Router {
  protected router: Route = {
    children: new Map(),
  }

  constructor() {}

  private setupPath(path: string, handler: Middleware | Endpoint | Router, type: HandlerType, method: Method): void {
    const parts = path.split('/')

    let current = this.router.children
    let targetPath = null
    let targetRoute = this.router

    for (const part of parts) {
      if (part === '') {
        continue
      }

      const isParam = part.startsWith(':')
      targetPath = isParam ? ':' : part
      targetRoute = current.get(targetPath) ?? {
        children: new Map(),
      }

      if (isParam) {
        targetRoute.paramName = part.substring(1)
      }

      current.set(targetPath, targetRoute)
      current = current.get(targetPath).children
    }

    if (type === HandlerType.ENDPOINT) {
      if (!targetRoute[method]) {
        targetRoute[method] = {}
      }
      targetRoute[method].endpoint = handler as Endpoint
      return
    }

    if (type === HandlerType.MIDDLEWARE) {
      if (!targetRoute[method]) {
        targetRoute[method] = {}
      }
      if (!Array.isArray(targetRoute[method].middlewares)) {
        targetRoute[method].middlewares = []
      }

      targetRoute[method].middlewares.push(handler as Middleware)
      return
    }

    if (type === HandlerType.ROUTER) {
      targetRoute.router = handler as Router
      return
    }
  }

  private processHandlers(method: Method, path: string, handlers: [...Middleware[], Middleware | Endpoint]) {
    for (let idx in handlers) {
      const handlerType = Number(idx) === handlers.length - 1 ? HandlerType.ENDPOINT : HandlerType.MIDDLEWARE
      this.setupPath(path, handlers[idx], handlerType, method)
    }
  }

  /**
   * Method for setting middlewares/router
   */
  use(arg1: string | Middleware, ...rest: Middleware[]) {
    let middlewares = [arg1, ...rest]
    let path = '/'

    if (typeof arg1 === 'string') {
      path = arg1
      middlewares.shift()
    }

    for (let middleware of middlewares as Middleware[]) {
      this.setupPath(path, middleware, HandlerType.MIDDLEWARE, 'all')
    }
  }

  /**
   * Method for setting GET method handlers
   */
  get(path: string, ...rest: [...Middleware[], Endpoint]) {
    this.processHandlers('get', path, rest)
  }

  /**
   * Method for setting POST method handlers
   */
  post(path: string, ...rest: [...Middleware[], Endpoint]) {
    this.processHandlers('post', path, rest)
  }

  /**
   * Method for setting PUT method handlers
   */
  put(path: string, ...rest: [...Middleware[], Endpoint]) {
    this.processHandlers('put', path, rest)
  }

  /**
   * Method for setting DELETE method handlers
   */
  delete(path: string, ...rest: [...Middleware[], Endpoint]) {
    this.processHandlers('delete', path, rest)
  }

  /**
   * Method for setting PATCH method handlers
   */
  patch(path: string, ...rest: [...Middleware[], Endpoint]) {
    this.processHandlers('patch', path, rest)
  }

  /**
   * Method for setting OPTIONS method handlers
   */
  options(path: string, ...rest: [...Middleware[], Endpoint]) {
    this.processHandlers('options', path, rest)
  }

  /**
   * Method for setting * method handlers
   */
  all(path: string, ...rest: [...Middleware[], Endpoint]) {
    this.processHandlers('all', path, rest)
  }
  /**
   * Method to handle current request and find corresponding handler
   */
  route() {
    // TODO: Implement request handler
  }
}
