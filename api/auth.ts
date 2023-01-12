import { Request, Response, NextFunction } from 'express'
import { exec } from 'child_process'
import { badRequestResponse, cliStderrResponse, unautorizedResponse } from './handlers/util'
const yaml = require('js-yaml')
const jwt = require('jsonwebtoken')

const jwtSecret = process.env.JWT_SECRET || '0be8fca8ad922f4e485a10ab53836f99a8e0fc565b2c4bdd197f572278b28d2e'

export const loginHandler = (req: Request, res: Response) => {

  const password = req.body && req.body.password

  console.log(password)

  // Exec the CLI validator login command
  exec(`operator-cli gui login ${password}`, (err, stdout, stderr) => {
    if (err) {
      cliStderrResponse(res, 'Unable to check login', err.message)
      return
    }
    if (stderr) {
      cliStderrResponse(res, 'Unable to check login', stderr)
      return
    }

    const cliResponse = yaml.load(stdout)

    if (cliResponse.login !== 'authorized') {
      badRequestResponse(res, 'Incorrect password.')
      return
    }
    const accessToken = jwt.sign({ nodeId: '' /** add unique node id  */ }, jwtSecret)
    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    })

    res.redirect(`http://localhost:${process.env.PORT || 8080}/`)
  })
  console.log('executing operator-cli gui login...')
}

export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {

//   const token = req.cookies.accessToken

//   if (!token) {
//     unautorizedResponse(res)
//     return
//   }

//   jwt.verify(token, jwtSecret, (err: any, jwtData: any) => {
//     if (err) {
//       // invalid token
//       unautorizedResponse(res)
//       return
//     }

//     next()
//   })

    next()
}
