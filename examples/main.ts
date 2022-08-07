import { App, MochiRequest, MochiResponse } from '../lib'

const app = new App()

app.get('/', (req: MochiRequest, res: MochiResponse) => {
  return res.json({ x: 'y' })
})

app.listen()
