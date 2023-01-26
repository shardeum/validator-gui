import { Request, Response } from 'express'

export function badRequestResponse(res: Response, msg: string) {
  console.log(`ERROR HTTP 400: ${msg}`)
  res.status(400).json({
    errorMessage: msg,
  })
  res.end()
}

export function cliStderrResponse(res: Response, msg: string, details: string) {
  console.log(`ERROR HTTP 400: ${msg}`)
  res.status(400).json({
    errorMessage: msg,
    errorDetails: details,
  })
  res.end()
}

export function unautorizedResponse(req: Request, res: Response) {
  res.status(403).json({
    errorMessage: 'unauthorized',
  })
  console.log(`ERROR HTTP 403: ${req.url}`)
}
