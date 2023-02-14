import { exec } from 'child_process';
import { Request, Response, Router } from 'express';
import {
  NodeNetworkResponse,
  NodePerformanceResponse,
  NodeStatus,
  NodeStatusHistoryResponse,
  NodeStatusResponse,
  NodeVersionResponse,
  SettingsResponse,
  StakeRequest
} from '../types/node-types';
import { badRequestResponse, cliStderrResponse } from './util';

const yaml = require('js-yaml')

export default function configureNodeHandlers(apiRouter: Router) {
  let lastActiveNodeState: NodeStatus;
  apiRouter.post('/node/start', (req: Request, res: Response) => {
    // Exec the CLI validator start command
    exec('operator-cli start', (err, stdout, stderr) => {
      if (err) {
        cliStderrResponse(res, 'Unable to start validator', err.message)
        return
      }
      if (stderr) {
        cliStderrResponse(res, 'Unable to start validator', stderr)
        return
      }
      res.status(200).json({status:"ok"})
    });
    console.log('executing operator-cli start...');
  });

  apiRouter.post('/node/stop', (req: Request, res: Response) => {
    // Exec the CLI validator stop command
    exec('operator-cli stop', (err, stdout, stderr) => {
      if (err) {
        cliStderrResponse(res, 'Unable to stop validator', err.message)
        res.end()
      }
      if (stderr) {
        cliStderrResponse(res, 'Unable to stop validator', stderr)
        res.end()
      }
      res.status(200).json({status:"ok"})
    });
    console.log('executing operator-cli stop...');
  });

  apiRouter.get(
    '/node/status',
    (req: Request, res: Response<NodeStatusResponse>) => {
      // Exec the CLI validator stop command
      exec('operator-cli status', (err, stdout, stderr) => {
        console.log('operator-cli status: ', err, stdout, stderr);
        if (err) {
          cliStderrResponse(res, 'Unable to fetch status', err.message)
          return
        }
        if (stderr) {
          cliStderrResponse(res, 'Unable to fetch status', stderr)
          return
        }
        let yamlData: NodeStatus = yaml.load(stdout);
        if (yamlData.state === 'active') {
          lastActiveNodeState = yamlData;
        } else if (yamlData.state === 'stopped') {
          yamlData = {
            ...yamlData,
            nodeInfo: lastActiveNodeState?.nodeInfo
          }
        }
        res.json(yamlData);
      });
      console.log('executing operator-cli status...');
    }
  );

  apiRouter.get(
    '/account/:address/stakeInfo',
    (req: Request, res: Response<NodeStatusResponse>) => {
      const address = req.params.address;
      if (!address) {
        badRequestResponse(res, 'No address provided');
        return;
      }
      exec('operator-cli stake_info ' + address, (err, stdout, stderr) => {
        console.log('operator-cli status: ', err, stdout, stderr);
        if (err) {
          cliStderrResponse(res, 'Unable to fetch stake info', err.message)
          return
        }
        if (stderr) {
          cliStderrResponse(res, 'Unable to fetch stake info', stderr)
          return
        }
        const yamlData = yaml.load(stdout);
        res.json(yamlData);
      });
      console.log('executing operator-cli status...');
    }
  );


  apiRouter.post(
    '/node/stake',
    (req: Request<StakeRequest>, res: Response) => {
      const amount = req.body.amount
      if (!amount) {
        badRequestResponse(res, 'no amount provided')
        return
      }

      // Exec the CLI validator stake command
      exec(`operator-cli stake ${amount}`, (err, stdout, stderr) => {
        console.log('operator-cli stake: ', err, stdout, stderr);
        if (err) {
          cliStderrResponse(res, 'Unable to execute stake', err.message)
          return
        }
        if (stderr) {
          cliStderrResponse(res, 'Unable to execute stake', stderr)
          return
        }
        res.end()
      });
      console.log('executing operator-cli stake...');
    }
  );


  apiRouter.post(
    '/node/unstake',
    (req: Request<StakeRequest>, res: Response) => {
      const amount = req.body.amount
      if (!amount) {
        badRequestResponse(res, 'no amount provided')
        return
      }

      // Exec the CLI validator stake command
      exec(`operator-cli unstake ${amount}`, (err, stdout, stderr) => {
        console.log('operator-cli unstake: ', err, stdout, stderr);
        if (err) {
          cliStderrResponse(res, 'Unable to execute unstake', err.message)
          return
        }
        if (stderr) {
          cliStderrResponse(res, 'Unable to execute unstake', stderr)
          return
        }
        res.end()
      });
      console.log('executing operator-cli unstake...');
    }
  );

  apiRouter.post(
    '/node/update',
    async (req: Request<StakeRequest>, res: Response) => {
      // Exec the CLI validator stake command
      const update = new Promise<void>((resolve, reject) => exec(`operator-cli update`, (err, stdout, stderr) => {
        console.log('operator-cli update: ', err, stdout, stderr);
        if (err) {
          cliStderrResponse(res, 'Error occurred while updating', err.message);
          reject();
        }
        if (stderr) {
          cliStderrResponse(res, 'Error occurred while updating', stderr);
          reject();
        }
        resolve();
      }));
      const restart = new Promise<void>((resolve, reject) => exec(`operator-cli gui restart`, (err, stdout, stderr) => {
        console.log('operator-cli gui restart: ', err, stdout, stderr);
        if (err) {
          cliStderrResponse(res, 'Error occurred while restarting the GUI', err.message);
          reject();
        }
        if (stderr) {
          cliStderrResponse(res, 'Error occurred while restarting the GUI', stderr);
          reject();
        }
        resolve();
      }));

      await update;
      await restart;
      res.end();
    }
  );

  apiRouter.post(
    '/node/status/history',
    (req: Request, res: Response<NodeStatusHistoryResponse>) => {
      const fromDate = req.query.from;

      if (!fromDate) {
        badRequestResponse(res, `invalid from Date parameter: '${fromDate}'`);
        return;
      }

      // Exec the CLI validator stop command
      exec('operator-cli status', (err, stdout, stderr) => {
        console.log('operator-cli status --from <date>: ', err, stdout, stderr);
        // res.end();
      });
      console.log(
        `executing operator-cli status --from ${fromDate.toString()}...`
      );

      // mock response
      res.json({
        state: 'active', //standby/syncing/active
        stakeAmount: '123456.78',
        lifetimeEarnings: '123.45',
        date: fromDate.toString(),
      });
    }
  );

  apiRouter.get(
    '/node/version',
    (req: Request, res: Response<NodeVersionResponse>) => {
      // Exec the CLI dashboard version command
      exec('operator-cli version', (err, stdout, stderr) => {
        console.log('operator-cli status: ', err, stdout, stderr);
        if (err) {
          cliStderrResponse(res, 'Unable to fetch network stats', err.message)
          return
        }
        if (stderr) {
          cliStderrResponse(res, 'Unable to fetch network stats', stderr)
          return
        }
        const yamlData: NodeVersionResponse = yaml.load(stdout);
        res.json(yamlData);
      });
      console.log('executing operator-cli version...');
    }
  );

  apiRouter.post(
    '/node/performance',
    (req: Request, res: Response<NodePerformanceResponse>) => {
      const fromDate = req.query.from?.toString() || '';
      const latestEntry = req.query.latestEntry;

      if (!fromDate && !latestEntry) {
        badRequestResponse(res, `invalid from Date parameter: '${fromDate}'`);
        return;
      }

      // Exec the CLI validator stop command
      exec('operator-cli performance', (err, stdout, stderr) => {
        console.log(
          'operator-cli performance --from <date>: ',
          err,
          stdout,
          stderr
        );
        // res.end();
      });
      console.log(`executing operator-cli performance --from ${fromDate}...`);

      // mock response
      res.json({
        cpu: 80,
        ram: 60,
        disk: 35,
        network: 15,
        tpsThroughput: 100,
        transactionsCount: 9,
        stateStorage: 45,
        date: fromDate,
      });
    }
  );

  apiRouter.get(
    '/node/network',
    (req: Request, res: Response<NodeNetworkResponse>) => {
      // Exec the CLI validator stop command
      exec('operator-cli network-stats', (err, stdout, stderr) => {
        console.log('operator-cli network-stats: ', err, stdout, stderr);
        if (err) {
          cliStderrResponse(res, 'Unable to fetch version', err.message)
          return
        }
        if (stderr) {
          cliStderrResponse(res, 'Unable to fetch version', stderr)
          return
        }
        const yamlData = yaml.load(stdout);
        res.json(yamlData);
      });
      console.log('executing operator-cli network-stats');
    });


  apiRouter.post(
    '/node/settings',
    (req: Request, res: Response<SettingsResponse>) => {
      // Exec the CLI validator stop command
      exec('operator-cli settings', (err, stdout, stderr) => {
        console.log('operator-cli settings: ', err, stdout, stderr);
        // res.end();
      });
      console.log('executing operator-cli settings...');

      // mock response
      res.json({
        rewardWalletAddress: "0xA206aB7db8EfB9ca23a869D34cDb332842D5F4ba",
        stakeWalletAddress: "0xA206aB7db8EfB9ca23a869D34cDb332842D5F4cc",
        alertEmail: "test@shardeum.com",
        alertPhoneNumber: "+11231231234"
      });
    }
  );
}
