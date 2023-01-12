import apiRouter from './api'
import { jwtMiddleware, loginHandler } from './auth'

const express = require('express')
const next = require('next')
var cookieParser = require('cookie-parser')

const port = process.env.PORT || 8080
const dev = process.env.NODE_ENV === 'development'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

nextApp.prepare().then(() => {
  const app = express()
  app.use(express.json());
  app.use(cookieParser())

  app.post('/auth/login', loginHandler)

  app.use('/api', jwtMiddleware, apiRouter)

  app.get('*', (req: any, res: any) => {
    return nextHandler(req, res)
  })

  app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`)
  })
})
