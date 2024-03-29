import { App, MochiRequest, MochiResponse, Router } from '../lib'

const app = new App()

app.get('/', (req: MochiRequest, res: MochiResponse) => {
  return res.json({ x: '/' })
})

app.get('/user', (req: MochiRequest, res: MochiResponse) => {
  return res.json({ x: '/user' })
})

app.get('/whatever/:id', (req: MochiRequest, res: MochiResponse) => {
  return res.json({ x: '/whatever/id', param: req.params['id'], query: req.query['l'] })
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

const router = new Router()

router.get('/dano', (req, res) => {
  return res.json({ x: 'Router dano' })
})

router.get('/', (req, res) => {
  return res.json({ x: 'Router /' })
})

app.use('/router', router)

app.use((req, res) => {
  console.log('Hello World')
})

const server = app.listen()
console.log(`[i] Server is running at ${server.hostname}`)
