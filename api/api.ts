import * as express from 'express'

import configureNodeHandlers from './handlers/node'
import fs from 'fs'
import path from 'path'
import { Request, Response } from 'express';
import asyncRouteHandler from './handlers/async-router-handler'
import { useGlobals } from '../utils/globals'
const yaml = require('js-yaml')

const apiRouter = express.Router()
configureNodeHandlers(apiRouter)

// app.get('/node/status', (req, res) => {
//   console.log('fetching node state');
//   res.send({
//     state: 'active',
//     lastActive: '2011-05-02T11:52:23.24Z',
//     stakeAmount: '40000000000000000000',
//     stakeRequirement: '20000000000000000000',
//     earnings: '200000000000000000',
//     lastPayout: '2011-05-02T11:52:23.24Z',
//     lifetimeEarnings: '200000000000000000',
//     stakeAddress: '0x23904...',
//   });
// });

apiRouter.get('/node/status/history', async (req, res) => {
  console.log('fetching node history')
  const { address: accountAddress } = req.query;
  const { accountInfoUrl } = useGlobals();
  const accInfoResponse = await fetch(
    `${accountInfoUrl}?address=${accountAddress}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  const data = await accInfoResponse.json();
  res.status(200).json(data?.accounts?.[0]?.account?.operatorAccountInfo?.operatorStats || {})
})

apiRouter.get('/node/performance', (req, res) => {
  console.log('fetching node state')
  res.send([
    {
      cpu: 42,
      ram: 23,
      disk: 93499234,
      network: 14,
      tpsThroughput: 14,
      transactionCount: 24242,
      stateStorage: 1412344,
      date: '2022-12-22T11:23:55.848Z',
    },
  ])
})

apiRouter.post('/log/stake', (req, res) => {
  console.log('Writing Stake TX logs')
  fs.appendFile(path.join(__dirname, '../stakeTXs.log'), JSON.stringify(req.body, undefined, 3), err => {
    if (err) {
      console.log(err)
      res.status(500).json({
        errorMessage: err,
      })
      return
    }
  })
  res.status(200).json({ status: 'ok' })
})

apiRouter.post('/log/unstake', (req, res) => {
  console.log('Writing Unstake TX logs')
  fs.appendFile(path.join(__dirname, '../unstakeTXs.log'), JSON.stringify(req.body, undefined, 3), err => {
    if (err) {
      console.log(err)
      res.status(500).json({
        errorMessage: err,
      })
      return
    }
  })
  res.status(200).json({ status: 'ok' })
})

apiRouter.post(
  '/claim-tokens',
  asyncRouteHandler(async (req: Request, res: Response) => {
    const { address: accountAddress } = req.query;
    const { faucetClaimUrl } = useGlobals();
    const claimResponse = await fetch(
      `${faucetClaimUrl}?address=${accountAddress}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const data = await claimResponse.json();
    res.status(200).json(data)
  }));

export default apiRouter
