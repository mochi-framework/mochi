import { App, MochiRequest, MochiResponse } from '../lib'

const app = new App()

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

app.listen()
