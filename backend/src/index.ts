
import * as express from 'express';
import path = require('path');
import configureAuthHandlers from './handlers/auth';
import configureCliHandlers from './handlers/node';

const app = express();
const port = process.env.PORT || 8080;

// define a route handler for the default home page
app.get('/', (req, res) => {
  // render the index template
  res.sendFile(path.join(__dirname, '../../../frontend/index.html'));
});

configureAuthHandlers(app)

configureCliHandlers(app)

// start the express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
