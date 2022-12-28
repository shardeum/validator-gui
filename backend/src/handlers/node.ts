import {exec} from 'child_process';
import {Request, Response, Express} from 'express';
import {badRequestResponse} from './util';

export default function configureCliHandlers(app: Express) {
  app.post('/node/start', (req: Request, res: Response) => {
    // Exec the CLI validator start command
    exec('operator-cli start', (err, stdout, stderr) => {
      console.log('operator-cli start result: ', err, stdout, stderr);
      res.end();
    });
    console.log('executing operator-cli start...');
  });

  app.post('/node/stop', (req: Request, res: Response) => {
    // Exec the CLI validator stop command
    exec('operator-cli stop', (err, stdout, stderr) => {
      console.log('operator-cli stop result: ', err, stdout, stderr);
      res.end();
    });
    console.log('executing operator-cli stop...');
  });

  app.post(
    '/node/status',
    (req: Request, res: Response<NodeStatusResponse>) => {
      // Exec the CLI validator stop command
      exec('operator-cli status', (err, stdout, stderr) => {
        console.log('operator-cli stop status: ', err, stdout, stderr);
        // res.end();
      });
      console.log('executing operator-cli status...');

      // mock response
      res.json({
        state: 'active', //standby/syncing/active
        totalTimeValidating: 5000,
        lastActive: new Date().toISOString(),
        stakeAmount: '123456.78',
        stakeRequirement: '123.45',
        stakeAddress: '0xA206aB7db8EfB9ca23a869D34cDb332842D5F4ba',
        earnings: '12.34',
        lastPayout: new Date().toISOString(),
        lifetimeEarnings: '123.45',
      });
    }
  );

  app.post(
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

  app.post(
    '/node/version',
    (req: Request, res: Response<NodeVersionResponse>) => {
      // Exec the CLI validator stop command
      exec('operator-cli version', (err, stdout, stderr) => {
        console.log('operator-cli version status: ', err, stdout, stderr);
        // res.end();
      });
      console.log('executing operator-cli status...');

      // mock response
      res.json({
        runningVersion: '1.00',
        minimumVersion: '1.00',
        latestVersion: '1.00',
      });
    }
  );

  app.post(
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

  app.post(
    '/node/network',
    (req: Request, res: Response<NodeNetworkResponse>) => {
      // Exec the CLI validator stop command
      exec('operator-cli network', (err, stdout, stderr) => {
        console.log('operator-cli network: ', err, stdout, stderr);
        // res.end();
      });
      console.log('executing operator-cli network...');

      // mock response
      res.json({
        size: {
          active: 9000,
          standBy: 5000,
          desired: 8000,
          joining: 6000,
          syncing: 12345,
        },
        load: {
          maxTps: 123,
          avgTps: 99,
          totalProcessed: 500,
        },
        health: {
          activeStandbyRatio: 60,
          desiredActiveStandbyRatio: 75,
        },
        reward: {
          dailyIssuance: '321.01',
          avgPerDay: '123.45',
          avgPerNodeDay: '111.23',
        },
        apr: {
          nodeApr: 75,
          avgApr: 55,
        },
      });
    }
  );


  app.post(
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
