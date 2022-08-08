import { Endpoint, Method, Middleware, RouteMap, Route, HandlerType } from './types'

export class Router {
  private router: RouteMap

  constructor() {}

  private setupPath(path: string, handler: Middleware | Endpoint | Router, type: HandlerType, method: Method): void {
    const parts = path.split('/')
    let current = this.router

    for (const part of parts) {
      if (part === '') {
        continue
      }

      const isParam = part.startsWith(':')
      const targetPath = isParam ? ':' : part
      const targetRoute: Route = current.get(targetPath) ?? {
        children: new Map(),
      }

      if (isParam) {
        targetRoute.paramName = part.substring(1)
      }

      current.set(targetPath, targetRoute)
      current = current.get(targetPath).children
    }

    const route = current.get('') ?? { [method]: {} }

    if (type === HandlerType.ENDPOINT) {
      route[method].handler = handler as Endpoint
      return
    }

    if (type === HandlerType.MIDDLEWARE) {
      if (!Array.isArray(route[method].middlewares)) {
        route[method].middlewares = []
      }

      route[method].middlewares.push(handler as Middleware)
      current.set('', route)
      return
    }

    if (type === HandlerType.ROUTER) {
      current.set('', {
        ...route,
        router: handler as Router,
      })
      return
    }
  }

  private processHandlers(method: Method, path: string, handlers: [...Middleware[], Endpoint]) {
    for (let idx in handlers) {
      const handlerType = Number(idx) === handlers.length - 1 ? HandlerType.ENDPOINT : HandlerType.MIDDLEWARE
      this.setupPath(path, handlers[idx], handlerType, method)
    }
  }

  /**
   * Method for setting middlewares/router
   */
  use(arg1: string | Middleware, ...rest: Middleware[]) {
    // TODO: Implement middleware/router setter
  }

  /**
   * Method for setting GET method handlers
   */
  get(path: string, mix: Middleware | Endpoint, ...rest: (Middleware | Endpoint)[]) {
    const endpoint = rest.length ? rest.pop() : mix
    const middlewares = rest.length ? [mix, ...rest] : []
    // TODO: Implement GET handler setter
  }

  /**
   * Method for setting POST method handlers
   */
  post(path: string, mix: Middleware | Endpoint, ...rest: (Middleware | Endpoint)[]) {
    const endpoint = rest.length ? rest.pop() : mix
    const middlewares = rest.length ? [mix, ...rest] : []
    // TODO: Implement POST handler setter
  }

  /**
   * Method for setting PUT method handlers
   */
  put(path: string, mix: Middleware | Endpoint, ...rest: (Middleware | Endpoint)[]) {
    const endpoint = rest.length ? rest.pop() : mix
    const middlewares = rest.length ? [mix, ...rest] : []
    // TODO: Implement PUT handler setter
  }

  /**
   * Method for setting DELETE method handlers
   */
  delete(path: string, mix: Middleware | Endpoint, ...rest: (Middleware | Endpoint)[]) {
    const endpoint = rest.length ? rest.pop() : mix
    const middlewares = rest.length ? [mix, ...rest] : []
    // TODO: Implement DELETE handler setter
  }

  /**
   * Method for setting * method handlers
   */
  all(path: string, mix: Middleware | Endpoint, ...rest: (Middleware | Endpoint)[]) {
    const endpoint = rest.length ? rest.pop() : mix
    const middlewares = rest.length ? [mix, ...rest] : []
    // TODO: Implement * handler setter
  }
  /**
   * Method to handle current request and find corresponding handler
   */
  route() {
    // TODO: Implement request handler
  }
}
