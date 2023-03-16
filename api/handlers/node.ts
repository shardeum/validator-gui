import { execFile } from 'child_process';
import { Request, Response, Router } from 'express';
import {
  NodeLogsResponse,
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
import path from 'path';

const yaml = require('js-yaml')

export default function configureNodeHandlers(apiRouter: Router) {
  let lastActiveNodeState: NodeStatus;
  apiRouter.post('/node/start', (req: Request, res: Response) => {
    // Exec the CLI validator start command
    execFile('operator-cli', ['start'], (err, stdout, stderr) => {
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
    execFile('operator-cli', ['stop'], (err, stdout, stderr) => {
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
      execFile('operator-cli', ['status'], (err, stdout, stderr) => {
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

  apiRouter.get('/node/logs', (req: Request, res: Response<NodeLogsResponse>) => {
    // Exec the CLI validator stop command
    execFile('ls', ['-m'], {cwd: path.join(__dirname, '../../../cli/build/logs')}, (err, stdout, stderr) => {
      if (err) {
        cliStderrResponse(res, 'Unable to get logs', err.message)
        res.end()
      }
      if (stderr) {
        cliStderrResponse(res, 'Unable to get logs', stderr)
        res.end()
      }
      const availableLogs = stdout.split(',').map((s: string) => s.trim());
      res.json(availableLogs);
    });
  });

  apiRouter.get('/node/logs/:file', (req: Request, res: Response<NodeLogsResponse>) => {
    const fileParam = req.params.file;
    const sanitizedFile = fileParam.replace(/[^a-zA-Z0-9.-]/g, '');
    const file = path.join(__dirname, '../../../cli/build/logs', sanitizedFile);
    res.download(file);
  });

  apiRouter.get(
    '/account/:address/stakeInfo',
    (req: Request, res: Response<NodeStatusResponse>) => {
      const address = req.params.address;
      if (!address) {
        badRequestResponse(res, 'No address provided');
        return;
      }
      execFile('operator-cli', ['stake_info', address], (err, stdout, stderr) => {
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
    '/node/update',
    async (req: Request<StakeRequest>, res: Response) => {
      // Exec the CLI validator stake command
      const update = new Promise<void>((resolve, reject) => execFile('operator-cli', ['update'], (err, stdout, stderr) => {
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
      const restart = new Promise<void>((resolve, reject) => execFile('operator-cli', ['gui', 'restart'], (err, stdout, stderr) => {
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
      execFile('operator-cli', ['status'], (err, stdout, stderr) => {
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
      execFile('operator-cli', ['version'], (err, stdout, stderr) => {
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
      execFile('operator-cli', ['performance'], (err, stdout, stderr) => {
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
      execFile('operator-cli', ['network-stats'], (err, stdout, stderr) => {
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
      execFile('operator-cli', ['settings'], (err, stdout, stderr) => {
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
