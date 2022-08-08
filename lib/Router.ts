import { Endpoint, Middleware, RouteMap } from './types'

export class Router {
  private router: RouteMap

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
