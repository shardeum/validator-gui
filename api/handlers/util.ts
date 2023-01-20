import { Request, Response } from 'express'

export function badRequestResponse(res: Response, msg: string) {
  res.status(400).json({
    errorMessage: msg,
  })
  res.end()
}

export function cliStderrResponse(res: Response, msg: string, details: string) {
  res.status(400).json({
    errorMessage: msg,
    errorDetails: details,
  })
  res.end()
}

export function unautorizedResponse(req: Request, res: Response) {
//   res.status(403).json({
//     errorMessage: 'unauthorized',
//   })
  res.redirect(`http://${req.hostname}:${process.env.PORT || 8080}/login`);
}
