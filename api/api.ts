import * as express from 'express'

import configureNodeHandlers from './handlers/node'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
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

apiRouter.get('/node/status/history', (req, res) => {
  console.log('fetching node history')
  // @ts-ignore
  if (req.params['from']) {
    res.send([
      {
        state: 'active',
        stakeAmount: '40000000000000000000',
        stakeRequirement: '20000000000000000000',
        lifetimeEarnings: '200000000000000000',
        date: '2011-05-02T11:52:23.24Z',
      },
      {
        state: 'active',
        stakeAmount: '40000000000000000000',
        stakeRequirement: '20000000000000000000',
        date: '2011-05-04T11:52:23.24Z',
      },
    ])
    // @ts-ignore
  } else if (req.params['latest']) {
    res.send({
      state: 'active',
      stakeAmount: '40000000000000000000',
      stakeRequirement: '20000000000000000000',
      date: '2011-07-04T11:52:23.24Z',
    })
  }
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

export default apiRouter
