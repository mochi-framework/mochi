import { App, MochiRequest, MochiResponse } from '../lib'

const app = new App({
  port: 3000,
})

app.get('/', (req: MochiRequest, res: MochiResponse) => {
  return res.json({ x: 'y' })
})

app.get('/user', (req: MochiRequest, res: MochiResponse) => {
  return res.json({ x: 'y' })
})

app.get('/whatever/:id', (req: MochiRequest, res: MochiResponse) => {
  return res.json({ x: 'y' })
})

app.get(
  '/midtest',
  (req, res) => {
    console.log('Middleware called')
  },
  (req, res) => {
    return res.json({ oki: 'oki' })
  },
)

app.use((req, res) => {
  console.log('Hello World')
})

const server = app.listen()
console.log(`[i] Server is running at ${server.hostname}`)
