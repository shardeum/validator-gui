import apiRouter from './api'
import { jwtMiddleware, loginHandler } from './auth'
import * as https from 'https';
import * as fs from 'fs';
import path from 'path';
import express from 'express';
import next from 'next';
import dotenv from 'dotenv';

dotenv.config()
const port = process.env.PORT ? +process.env.PORT : 8080
const dev = process.env.NODE_ENV === 'development'
const nextApp = next({dev, port})
const nextHandler = nextApp.getRequestHandler()

nextApp.prepare().then(() => {
  const app = express()
  app.use(express.json());

  app.post('/auth/login', loginHandler)

  app.use('/api', jwtMiddleware, apiRouter)

  app.get('*', (req: any, res: any) => {
    return nextHandler(req, res)
  })

  if (!dev) {
    const privateKey = fs.readFileSync(path.join(__dirname, '../selfsigned.key'), 'utf8');
    const certificate = fs.readFileSync(path.join(__dirname, '../selfsigned.crt'), 'utf8');

    const credentials = {key: privateKey, cert: certificate};
    https.createServer(credentials, app)
      .listen(port, () => {
        console.log(`server started at https://localhost:${port}`)
      })
  } else {
    app.listen(port, () => {
      console.log(`server started at http://localhost:${port}`)
    })
  }
})
