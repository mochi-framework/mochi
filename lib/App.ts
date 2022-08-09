import { Server } from 'bun'
import { MochiRequest } from './MochiRequest'
import { MochiResponse } from './MochiResponse'
import { Router } from './Router'
import { Config } from './types'

export class App extends Router {
  constructor(private config: Config = {}) {
    super()

    this.config = {
      port: 3000,
      ...config,
    }
  }

  /**
   * Method to start app and listen to incoming requests
   */
  listen(): Server {
    console.debug(this.router)
    const server = Bun.serve({
      fetch: async (req: MochiRequest): Promise<Response> => {
        const fullPath = '/' + req.url.replace(server.hostname, '')
        const [path, rawParams] = fullPath.split('?')
        let params = {}
        if (rawParams) {
          params = rawParams.split('&').reduce((acc, param) => {
            const [key, val] = param.split('=')
            acc[key] = val
            return acc
          }, {})
        }
        req.query = params
        req.params = {}
        req.body = await req.json()
        return this.route(path, req, new MochiResponse())
      },
      port: this.config.port,
      ...(this.config.host ? { hostname: this.config.host } : {}),
    })

    return server
  }
}
