import { MochiRequest } from './MochiRequest'
import { MochiResponse } from './MochiResponse'
import { Endpoint, HandlerType, Method, Middleware, Route } from './types'

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
  use(arg1: string | Middleware | Router, ...rest: Array<Middleware | Router>) {
    let handlers = [arg1, ...rest]
    let path = '/'

    if (typeof arg1 === 'string') {
      path = arg1
      handlers.shift()
    }

    for (let handler of handlers as Array<Middleware | Router>) {
      if (handler instanceof Router) {
        this.setupPath(path, handler, HandlerType.ROUTER, 'all')
        continue
      }
      this.setupPath(path, handler, HandlerType.MIDDLEWARE, 'all')
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

  async handleMiddlewares(req: MochiRequest, res: MochiResponse, middlewares: Middleware[]): Promise<Response | null> {
    for (const middleware of middlewares) {
      const response = await middleware(req, res)
      if (response) {
        return response
      }
    }
  }

  /**
   * Method to handle current request and find corresponding handler
   */
  async route(parts: string[], req: MochiRequest, res: MochiResponse): Promise<Response> {
    const method = req.method.toLocaleLowerCase() as Method
    let targetRoute = this.router
    let targetMap = targetRoute.children

    // Check global middlewares
    if (targetRoute?.all?.middlewares) {
      let response = await this.handleMiddlewares(req, res, targetRoute.all.middlewares)
      if (response) {
        return response
      }
    }
    if (targetRoute?.[method]?.middlewares) {
      let response = await this.handleMiddlewares(req, res, targetRoute[method].middlewares)
      if (response) {
        return response
      }
    }
    // Continue in routing
    for (let idx in parts) {
      const part = parts[idx]
      if (part === '') continue
      let hasParam = false
      if (!targetMap.has(part)) {
        // Check for param
        if (targetMap.has(':')) {
          hasParam = true
          req.params[targetMap.get(':').paramName] = part
          // Check for router
        } else if (targetRoute.router) {
          return targetRoute.router.route(parts.slice(Number(idx + 1)), req, res)
          // Handle invalid path
        } else {
          return res.lost('Invalid path')
        }
      }
      targetRoute = targetMap.get(hasParam ? ':' : part)
      targetMap = targetRoute.children
      // Check path middlewares
      if (targetRoute?.all?.middlewares) {
        let response = await this.handleMiddlewares(req, res, targetRoute.all.middlewares)
        if (response) {
          return response
        }
      }
      if (targetRoute?.[method]?.middlewares) {
        let response = await this.handleMiddlewares(req, res, targetRoute[method].middlewares)
        if (response) {
          return response
        }
      }
      if (targetRoute.router) {
        return targetRoute.router.route(parts.slice(Number(idx + 1)), req, res)
      }
    }

    // Handle found path

    const handler = targetRoute?.[method]?.endpoint ?? targetRoute?.all?.endpoint
    if (handler) {
      return await handler(req, res)
    }
    if (targetRoute.router) {
      return targetRoute.router.route(parts.slice(-1), req, res)
    }
    return res.lost('Undefined route')
  }
}
