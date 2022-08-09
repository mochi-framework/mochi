import { Server } from 'bun'
import { Router } from './Router'
import { Config } from './types'

export class App extends Router {
  constructor(private config: Config) {
    super()
  }

  /**
   * Method to start app and listen to incoming requests
   */
  listen(): Server {
    //TODO: Implement server listener
    const server = Bun.serve({
      fetch: (req: Request): Response => {
        const path = '/' + req.url.replace(server.hostname, '')
        return new Response(`Thank you for visiting ${path}`)
      },
      port: this.config.port,
      ...(this.config.host ? { hostname: this.config.host } : {}),
    })

    return server
  }
}
