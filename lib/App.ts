import { Router } from './Router'

export class App extends Router {
  constructor(private config: object = {}) {
    super()
  }

  /**
   * Method to start app and listen to incoming requests
   */
  listen() {
    //TODO: Implement server listener
    console.log(this.router)
  }
}
