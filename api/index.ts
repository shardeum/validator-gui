import apiRouter from "./api"

const express = require('express')
const next = require('next')

const port = process.env.PORT || 8080
const dev = process.env.NODE_ENV === 'development'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

nextApp.prepare().then(() => {
  const app = express()
  const port = process.env.PORT || 8080

  app.use('/api', apiRouter)

  app.get('*', (req: any, res: any) => {
    return nextHandler(req, res)
  })

  app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`)
  })
})

